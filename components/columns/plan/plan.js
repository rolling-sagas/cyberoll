'use client';
import { Button } from '@/app/components/ui/button';
import { getCurrentCredits, getCurrentSubscription } from '@/service/credits';
import { createCustomerPortalSession } from '@/service/stripe';
import { markChangeSubscription } from '@/service/subscription';
import { featureCtrl } from '@/stores/ctrl';
import { PLAN, PRICE_PLAN } from '@/utils/credit';
import dayjs from '@/utils/day';
import { capitalizeFirstLetter } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Loading from '../spinner';

export default function Plan() {
  const [currentSubscription, setCurrentSubscription] = useState({
    plan: PLAN.FREE,
  });
  const [credits, setCredits] = useState({
    daily: 0,
    monthly: 0,
  });
  const [isLoading, setIsloading] = useState(false);
  const [cancelModel, setCancelModel] = useState('');
  const proceedingModalRef = useRef(null);
  const successModalRef = useRef(null);
  const refundRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsloading(true);
      try {
        const [subscription, credits] = await Promise.all([
          getCurrentSubscription(),
          getCurrentCredits(),
        ]);
        // console.log('subscription', subscription);
        // console.log('credits', credits);
        setCurrentSubscription(subscription);
        setCancelModel(
          subscription?.isCancelAtPeriodEnd ? 'uncancel' : 'cancel'
        );
        setCredits(credits);
      } finally {
        setIsloading(false);
      }
    };
    fetchData();
  }, []);

  const onClose = () => {
    successModalRef.current.close();
  };

  const onChangePlan = async () => {
    if (
      currentSubscription.plan === PLAN.FREE ||
      currentSubscription.platform === 'paypal'
    ) {
      return router.push('/pricing');
    }
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      const currentPlan = currentSubscription.plan;
      const customerUrl = await createCustomerPortalSession(url);
      console.log('onChangePlan', currentPlan, customerUrl);
      if (customerUrl) {
        markChangeSubscription();
        window.location.href = customerUrl;
      }
    }
  };

  // const onRecoverBill = async () => {
  //   const res = await recoverBill();
  //   if (res.ok) {
  //     setRecover(true);
  //   }
  //   setTimeout(() => {
  //     setRecover(false);
  //   }, 1000);
  // };

  console.log('cancelModel', cancelModel);

  if (isLoading) return <Loading />;
  return (
    <div className="mx-6 xy-4">
      {featureCtrl.enablePricing && (
        <div className="flex md:flex-row border-b-1 gap-3 pb-[32px] mt-10">
          <div className="text-base font-semibold leading-normal w-44">
            Subscription
          </div>
          <div className="flex flex-1 flex-col">
            <div className="text-base font-semibold leading-normal">{`${capitalizeFirstLetter(
              currentSubscription.plan
            )} ${
              (currentSubscription?.interval &&
                (currentSubscription?.interval === 'year'
                  ? 'Annually'
                  : 'Monthly')) ||
              ''
            }`}</div>
          </div>
          <div className="SubscriptionDetails__actions__EqSLO">
            <Button variant="outline" onClick={onChangePlan}>
              Change plan
            </Button>
          </div>
        </div>
      )}
      {/* <div className="flex md:flex-row border-b-1 gap-3 pb-[32px] mt-10"> */}
      <div className="flex md:flex-row gap-3 pb-[32px] mt-10">
        <div className="text-base font-semibold leading-normal w-44">
          Credits
        </div>
        {currentSubscription.plan === PLAN.STANDARD && (
          <div className="flex flex-1 flex-col">
            <div className="text-base font-semibold leading-normal">
              <strong>{credits.monthly}/700 </strong>
              monthly credits{' '}
            </div>
            <div className="md:mb-[36px] text-sm font-normal">
              Monthly credits reset on{' '}
              {currentSubscription.interval === 'year'
                ? dayjs(currentSubscription.start).format('MMM DD, YYYY')
                : dayjs(currentSubscription.end).format('MMM DD, YYYY')}
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <div className="text-sm leading-5">
                  <strong>{credits.daily} </strong>
                  daily login credits
                </div>
              </div>
            </div>
          </div>
        )}
        {currentSubscription.plan === PLAN.FREE && (
          <div className="flex flex-1 flex-col">
            <div className="text-base font-semibold leading-normal">
              {`${credits.daily} `}daily login credits
              <div className="font-light">
                Daily credits reset at 00:00 UTC.
              </div>
            </div>
          </div>
        )}
        {currentSubscription.plan === PLAN.ADVANCED && (
          <div className="flex flex-1 flex-col">
            <div className="text-base font-semibold leading-normal">
              <strong>Unlimited </strong>
            </div>
          </div>
        )}
        {featureCtrl.enablePricing && (
          <div className="md:justify-end flex row gap-2">
            <Button variant="outline" onClick={onChangePlan}>
              Get credits
            </Button>
          </div>
        )}
      </div>
      {featureCtrl.enablePricing && (
        <div className="flex md:flex-row border-b-1 gap-3 pb-[32px] mt-10">
          <div className="text-base font-semibold leading-normal w-44">
            Billing & Payment
          </div>
          {currentSubscription.plan != PLAN.FREE && (
            <div className="flex flex-1 flex-col">
              <div className="text-base font-semibold leading-normal">
                $
                {
                  PRICE_PLAN[
                    `${currentSubscription.plan}_${currentSubscription.interval}`
                  ]
                }
                /{currentSubscription.interval}
              </div>
              <div className="mt-1 text-sm font-normal">
                Billing period:{' '}
                {currentSubscription.interval === 'year'
                  ? 'Annually'
                  : 'Monthly'}
              </div>
              <div className="mt-1 md:mb-[36px] text-sm font-normal">
                {currentSubscription?.isCancelAtPeriodEnd
                  ? `Cancelling on: ${dayjs(currentSubscription.end).format(
                      'MMM DD, YYYY'
                    )}`
                  : `Renewal date: ${dayjs(currentSubscription.end).format(
                      'MMM DD, YYYY'
                    )}`}
              </div>
            </div>
          )}
          {currentSubscription.plan === PLAN.FREE && (
            <div className="flex flex-1 flex-col">
              <div className="text-base font-semibold leading-normal">None</div>
            </div>
          )}
          {currentSubscription.plan != PLAN.FREE &&
            currentSubscription.platform !== 'paypal' && (
              <div className="md:justify-end flex row gap-2">
                {currentSubscription?.isCancelAtPeriodEnd ? (
                  <Button variant="outline" onClick={onChangePlan}>
                    Uncancel plan
                  </Button>
                ) : (
                  <Button variant="outline" onClick={onChangePlan}>
                    Cancel plan
                  </Button>
                )}
                {/* <Button variant="outline" onClick={onRecoverBill}>
              Recover Bill
            </Button> */}
              </div>
            )}
        </div>
      )}
      <dialog id="my_modal_3" className="modal" ref={proceedingModalRef}>
        <div className="modal-box">
          <form method="dialog" className="flex items-center">
            <div className="inline-flex w-full items-center justify-start gap-3 text-left font-semibold leading-6 text-xl">
              {cancelModel === 'uncancel'
                ? "We're happy to see you again!"
                : "We're sorry to see you go!"}
            </div>
            <button className="btn btn-md btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="shrink-0 py-4">
            <h2 className="text-red-600">Processing...</h2>
            <div className="my-2 flex flex-col gap-6 text-left">
              <p>
                Please wait while the update is confirmed. If this takes longer
                than a minute, please contact{' '}
                <span className="text-red-600">support@rollingsagas.com</span>{' '}
              </p>
              <div className="flex w-full items-center justify-center gap-4 border-[1.5px] border-dashed p-3 text-left border-blue-900/70 text-blue-600 bg-blue-500/5 .text-slate-100 rounded-lg  sm:justify-between undefined">
                <h3 className="text-base font-normal ">Update confirming...</h3>
                <div className="flex size-6 items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="rotate-180 animate-spin text-blue-700size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="sm:pt-2 mt-0 rounded-b-xl bg-light-bg dark:bg-dark-800">
            <div className="flex flex-col-reverse flex-wrap gap-4 xs:flex-row xs:flex-nowrap">
              <button className="btn  btn-neutral items-center py-2.5 empty:hidden px-1 w-full font-medium !text-base transition rounded-md buttonActiveRing select-none disabled:bg-opacity-40 disabled:text-light-600 dark:disabled:text-dark-500 disabled:pointer-events-none bg-light-800 dark:bg-dark-700 dark:shadow-button">
                Please wait
              </button>
            </div>
          </div>
        </div>
      </dialog>
      <dialog id="my_modal_4" className="modal" ref={successModalRef}>
        <div className="modal-box">
          <form method="dialog" className="flex items-center">
            <div className="inline-flex w-full items-center justify-start gap-3 text-left font-semibold leading-6 text-xl">
              {cancelModel === 'uncancel'
                ? "We're happy to see you again!"
                : "We're sorry to see you go!"}
            </div>
            <button className="btn btn-md btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="shrink-0 py-4">
            <h2 className="text-red-600">Success!</h2>
            <div className="my-2 flex flex-col gap-6 text-left">
              <p> Your change has been confirmed. </p>
              <div className="flex w-full items-center justify-center gap-4 border-[1.5px] border-dashed p-3 text-left border-emerald-900/70 text-emerald-600 bg-emerald-500/5 .text-slate-100 rounded-lg  sm:justify-between">
                <h3 className="text-base font-normal">Update confirmed</h3>
                <div className="flex size-6 items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="text-emerald-600 size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="sm:pt-2 mt-0 rounded-b-xl bg-light-bg dark:bg-dark-800">
            <div className="flex flex-col-reverse flex-wrap gap-4 xs:flex-row xs:flex-nowrap">
              <button
                className="btn items-center py-2.5 empty:hidden px-1 w-full font-medium !text-base transition rounded-md buttonActiveRing select-none disabled:bg-opacity-40 disabled:text-light-600 dark:disabled:text-dark-500 disabled:pointer-events-none bg-light-800 dark:bg-dark-700 dark:shadow-button"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </dialog>
      <dialog id="my_modal_5" className="modal" ref={refundRef}>
        <div className="modal-box">
          <form method="dialog" className="flex items-center">
            <div className="inline-flex w-full items-center justify-start gap-3 text-left font-semibold leading-6 text-xl">
              {cancelModel === 'uncancel'
                ? `We&apos;re sorry to see you go!`
                : `We &apos;re happy to see you again!`}
            </div>
            <button className="btn btn-md btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="items-left flex flex-col justify-start gap-2 ">
            <h2 className="text-lg ">Choose your timeframe</h2>
            <p>
              Changing plan now will prorate your unused Fast Hours, crediting
              them towards the next month&apos;s cost.
            </p>
            <fieldset className="mt-4">
              <legend className="sr-only">Cancel timeframe</legend>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="end_of_period"
                    name="cancel-timeframe"
                    type="radio"
                    className="size-4 cursor-pointer border-light-300 "
                  />
                  <label
                    htmlFor="end_of_period"
                    className="ml-3 block cursor-pointer  font-medium "
                  >
                    Swap at end of subscription period
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="now"
                    name="cancel-timeframe"
                    type="radio"
                    className="size-4 cursor-pointer border-light-300 "
                  />
                  <label
                    htmlFor="now"
                    className="ml-3 block cursor-pointer  font-medium "
                  >
                    Swap immediately with proration
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
          <div className="sm:pt-2 mt-0 rounded-b-xl bg-light-bg dark:bg-dark-800">
            <div className="flex flex-col-reverse flex-wrap gap-4 xs:flex-row xs:flex-nowrap">
              <button
                className="btn items-center py-2.5 empty:hidden px-1 w-full font-medium !text-base transition rounded-md buttonActiveRing select-none disabled:bg-opacity-40 disabled:text-light-600 dark:disabled:text-dark-500 disabled:pointer-events-none bg-light-800 dark:bg-dark-700 dark:shadow-button"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
