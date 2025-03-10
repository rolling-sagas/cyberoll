'use client';

import { useState, useEffect } from 'react';
import { useToggleStore } from '@/stores/pricing';
import { PLAN } from '@/utils/credit';
import { useRef } from 'react';
import Link from 'next/link';
import { capitalizeFirstLetter } from '@/utils/utils';
import { PRICE_PLAN } from '@/utils/credit';
import { updateSubscription } from '@/service/stripe';
import { createCheckoutSession } from '@/service/stripe';
import { getPricesByProductId } from '@/service/stripe';
import { PRODUCT_ID_PLAN, convertPricesToPlanObject } from '@/utils/product';
import dayjs from '@/utils/day';
import { Button } from '@/app/components/ui/button';
import './index.css';
import { InformationCircleIcon } from '@hugeicons/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Tabs, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

const subscription_list = {
  free: {
    recommend: 'Play story for free',
    rights: [
      {
        right: '30 credits daily login rewards',
      },
      {
        right: 'Access to advanced AI language model',
      },
      {
        right: 'AI assisted story creation',
      },
    ],
  },
  standard: {
    recommend: 'Boost your play experience with AI',
    rights: [
      {
        right: '700 monthly credits',
        tip: "Credits reset to 700 every month starting from your subscription date. Credits that aren't used do not roll over to the next month.",
      },
      {
        right: '60 credits daily login rewards',
        tip: 'Daily login rewards will be deducted before monthly credits.',
      },
      {
        right: 'Access to advanced AI language model',
      },
      {
        right: 'AI assisted story creation',
      },
      {
        right: 'Priority generation queue',
      },
      {
        right: 'Early access to new features',
      },
    ],
  },
  advanced: {
    recommend:
      'Unleash your storytelling potential with infinite AI generations',
    rights: [
      {
        right: 'Unlimited credits',
      },
      {
        right: 'Access to advanced AI language model',
      },
      {
        right: 'AI assisted story creation',
      },
      {
        right: 'Priority generation queue',
      },
      {
        right: 'Early access to new features',
      },
    ],
  },
};

const StandardItem = (activeTab, subscription_list, subscription, onChange) => (
  <div className="lg:h-[755px] 2xl:h-[805px] bg-background shadow-[0px_10px_20px_rgba(0,0,0,0.05)] transition-all duration-500 dark:bg-neutral-800 dark:shadow-none  overflow-hidden rounded-[2.3rem] p-0 mobile:w-full lg:w-[380px] xl:w-[420px]]  2xl:w-[500px] [.modal_&amp;]:max-h-[471px] [.modal_&amp;]:w-[262px] [.modal_&amp;]:rounded-xl [.modal_&amp;]:shadow-[0px_4px_20px_0px_rgba(0,0,0,0.08)] dark:[.modal_&amp;]:shadow-none">
    <div className="h-full bg-background p-[3rem] shadow-[0px_10px_20px_rgba(0,0,0,0.05)] transition-all duration-500 dark:bg-neutral-800 dark:shadow-none group flex  w-full flex-col rounded-2xl [.modal_&amp;]:rounded-[11px]">
      <div className="flex flex-col gap-3 [.modal_&amp;]:gap-2">
        <div className="flex h-8 items-center justify-between [.modal_&amp;]:h-6">
          <h3 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold text-neutral-900 transition-all duration-500 dark:text-background [.modal_&amp;]:text-base [.modal_&amp;]:font-semibold">
            Standard
          </h3>
        </div>
      </div>
      <p className="block h-16 mt-4 font-normal text-base lg:text-xl 2xl:text-2xl  text-neutral-600 transition-all duration-500 dark:text-neutral-40 [.modal_&amp;]:text-xs">
        {subscription_list['standard'].recommend}
      </p>
      <div className="lg:mt-10 flex items-center gap-2 [.modal_&amp;]:mt-auto">
        <span className="text-[50px] 2xl:text-[60px] font-semibold leading-[72px] text-neutral-900 transition-all duration-500 dark:text-background [.modal_&amp;]:text-5xl [.modal_&amp;]:leading-[60px]">
          {activeTab === 'annually' ? '$96' : '$10'}
        </span>
        <div className="flex flex-col items-start justify-center">
          {activeTab === 'annually' && (
            <span className="text-gray-300 text-xl font-medium leading-[30px]  line-through transition-all duration-500 dark:text-primary-200 [.modal_&amp;]:text-lg [.modal_&amp;]:leading-6">
              $120
            </span>
          )}
          <span className="text-base font-medium text-neutral-600 transition-all duration-500 dark:text-neutral-40 [.modal_&amp;]:text-sm">
            {activeTab === 'annually' ? '/year' : '/month'}
          </span>
        </div>
      </div>
      <div className="flex flex-row gap-1 2xl:pt-1 text-sm 2xl:text-base font-medium leading-6 text-primary-700 transition-colors duration-500 dark:text-primary-200 [.modal_&amp;]:text-[11px] [.modal_&amp;]:leading-4">
        <div className="mt-4 flex items-center justify-center rounded-lg bg-primary-500 bg-opacity-[0.15] px-2 py-1">
          <p>Billed {activeTab === 'annually' ? 'annually' : 'monthly'}</p>
        </div>
        {activeTab === 'annually' && (
          <div className="text-success-500 mt-4 flex items-center justify-center rounded-lg bg-primary-500 bg-opacity-[0.15] px-2 py-1 ">
            <svg width="12" height="12" fill="none" viewBox="0 0 12 12">
              <path
                fill="currentColor"
                d="M8.027 1H4.682a.496.496 0 0 0-.476.337L2.522 6.58c-.098.307.141.617.476.617H5.31l-.764 3.218c-.117.494.544.8.874.404l3.97-4.754c.26-.312.029-.775-.389-.775H6.802l1.68-3.62c.146-.315-.095-.67-.455-.67Z"
              ></path>
            </svg>
            <p>20% off</p>
          </div>
        )}
      </div>
      {subscription.plan === PLAN.STANDARD &&
      subscription.interval ===
        (activeTab === 'annually' ? 'year' : 'month') ? (
        <Button className="!pointer-events-none !text-black !text-lg !border-transparent !h-14 btn-primary !bg-orange-400  active:translate-y-[0.0625rem] active:transform active:!bg-orange-500 disabled:active:translate-y-0 disabled:text-neutral-900 disabled:shadow-none disabled:cursor-default translate-y-0 [transition:color_500ms,background-color_500ms,border-color_500ms,text-decoration-color_500ms,fill_500ms,stroke_500ms,transform] disabled:opacity-50 dark:disabled:opacity-30 dark:disabled:text-background bg-primary-500 text-background hover:bg-primary-400 hover:shadow-[0_4px_15px_rgba(107,109,216,0.35)] dark:bg-primary-500 dark:text-background dark:hover:bg-primary-400 disabled:bg-neutral-100 dark:disabled:bg-neutral-700 rounded-xl px-5 py-3  mt-6 w-full [.modal_&]:hidden">
          Active
        </Button>
      ) : subscription.plan === PLAN.STANDARD ? (
        <Button
          className="!text-black !text-lg !border-transparent !h-14 btn-primary !bg-amber-400  active:translate-y-[0.0625rem] active:transform active:!bg-orange-500 disabled:active:translate-y-0 disabled:text-neutral-900 disabled:shadow-none disabled:cursor-default translate-y-0 [transition:color_500ms,background-color_500ms,border-color_500ms,text-decoration-color_500ms,fill_500ms,stroke_500ms,transform] disabled:opacity-50 dark:disabled:opacity-30 dark:disabled:text-background bg-primary-500 text-background hover:bg-primary-400 hover:shadow-[0_4px_15px_rgba(107,109,216,0.35)] dark:bg-primary-500 dark:text-background dark:hover:bg-primary-400 disabled:bg-neutral-100 dark:disabled:bg-neutral-700 rounded-xl px-5 py-3  mt-6 w-full [.modal_&]:hidden"
          onClick={onChange}
        >
          Change Commitment
        </Button>
      ) : (
        <Button className="!text-black !text-lg !border-transparent !h-14 btn-primary !bg-amber-400  active:translate-y-[0.0625rem] active:transform active:!bg-orange-500 disabled:active:translate-y-0 disabled:text-neutral-900 disabled:shadow-none disabled:cursor-default translate-y-0 [transition:color_500ms,background-color_500ms,border-color_500ms,text-decoration-color_500ms,fill_500ms,stroke_500ms,transform] disabled:opacity-50 dark:disabled:opacity-30 dark:disabled:text-background bg-primary-500 text-background hover:bg-primary-400 hover:shadow-[0_4px_15px_rgba(107,109,216,0.35)] dark:bg-primary-500 dark:text-background dark:hover:bg-primary-400 disabled:bg-neutral-100 dark:disabled:bg-neutral-700 rounded-xl px-5 py-3  mt-6 w-full [.modal_&]:hidden">
          Upgrade
        </Button>
      )}

      <div className="mb-[42px] flex flex-col gap-3 [.modal_&amp;]:mb-0 mt-10">
        <ul className="flex flex-col gap-3">
          {subscription_list['standard'].rights.map((item) => (
            <li
              key={`standard_${item.right}`}
              className="flex items-center gap-1.5"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                className="size-[18px] stroke-[1.75] text-success-600 dark:text-success-400 [.modal_&amp;]:size-4 [.modal_&amp;]:stroke-[1.5]"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="currentStroke"
                  d="m5 11.25 5.158 5.25L19 7.5"
                ></path>
              </svg>
              <span className="flex flex-row items-center text-base leading-6 font-normal text-neutral-900 transition-all duration-500 dark:text-background [.modal_&amp;]:text-xs [.modal_&amp;]:font-normal [.modal_&amp;]:leading-6">
                {item.right}
                {item.tip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InformationCircleIcon size={18} className="ml-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-48 text-sm">{item.tip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const AdvancedItem = (activeTab, subscription_list, subscription, onChange) => (
  <div className="relative mt-12 lg:mt-0">
    <div className="font-medium absolute left-0 bg-violet-500 text-white w-full -top-8 2xl:-top-12  text-center h-32 text-lg 2xl:text-xl leading-[2rem] 2xl:leading-[3rem] rounded-[1.25rem]">
      Best value
    </div>
    <div className="relative lg:h-[755px] 2xl:h-[805px] border-4 border-solid border-violet-500 bg-background shadow-[0px_10px_20px_rgba(0,0,0,0.05)] transition-all duration-500 dark:bg-neutral-800 dark:shadow-none  overflow-hidden rounded-[2.3rem] p-0 mobile:w-full lg:w-[380px] xl:w-[420px]] 2xl:w-[500px] [.modal_&amp;]:max-h-[471px] [.modal_&amp;]:w-[262px] [.modal_&amp;]:rounded-xl [.modal_&amp;]:shadow-[0px_4px_20px_0px_rgba(0,0,0,0.08)] dark:[.modal_&amp;]:shadow-none">
      <div className="h-full bg-background p-[3rem] shadow-[0px_10px_20px_rgba(0,0,0,0.05)] transition-all duration-500 dark:bg-neutral-800 dark:shadow-none group flex  w-full flex-col rounded-2xl [.modal_&amp;]:rounded-[11px]">
        <div className="flex flex-col gap-3 [.modal_&amp;]:gap-2">
          <div className="flex h-8 items-center justify-between [.modal_&amp;]:h-6">
            <h3 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold text-neutral-900 transition-all duration-500 dark:text-background [.modal_&amp;]:text-base [.modal_&amp;]:font-semibold">
              Advanced
            </h3>
          </div>
        </div>
        <p className="block h-16 mt-4 font-normal text-base lg:text-xl 2xl:text-2xl  text-neutral-600 transition-all duration-500 dark:text-neutral-40 [.modal_&amp;]:text-xs">
          {subscription_list['advanced'].recommend}
        </p>
        <div className="lg:mt-10 flex items-center gap-2 [.modal_&amp;]:mt-auto">
          <span className="text-[50px] 2xl:text-[60px] font-semibold leading-[72px] text-neutral-900 transition-all duration-500 dark:text-background [.modal_&amp;]:text-5xl [.modal_&amp;]:leading-[60px]">
            {activeTab === 'annually' ? '$144' : '$15'}
          </span>
          <div className="flex flex-col items-start justify-center">
            {activeTab === 'annually' && (
              <span className="text-gray-300  text-xl font-medium leading-[30px]  line-through transition-all duration-500 dark:text-primary-200 [.modal_&amp;]:text-lg [.modal_&amp;]:leading-6">
                $180
              </span>
            )}
            <span className="text-base font-medium text-neutral-600 transition-all duration-500 dark:text-neutral-40 [.modal_&amp;]:text-sm">
              {activeTab === 'annually' ? '/year' : '/month'}
            </span>
          </div>
        </div>
        <div className="flex flex-row gap-1 2xl:pt-1 text-sm 2xl:text-base font-medium leading-6 text-primary-700 transition-colors duration-500 dark:text-primary-200 [.modal_&amp;]:text-[11px] [.modal_&amp;]:leading-4">
          <div className="mt-4 flex items-center justify-center rounded-lg bg-primary-500 bg-opacity-[0.15] px-2 py-1">
            <p>Billed {activeTab === 'annually' ? 'annually' : 'monthly'}</p>
          </div>
          {activeTab === 'annually' && (
            <div className="text-success-500 mt-4 flex items-center justify-center rounded-lg bg-primary-500 bg-opacity-[0.15] px-2 py-1 ">
              <svg width="12" height="12" fill="none" viewBox="0 0 12 12">
                <path
                  fill="currentColor"
                  d="M8.027 1H4.682a.496.496 0 0 0-.476.337L2.522 6.58c-.098.307.141.617.476.617H5.31l-.764 3.218c-.117.494.544.8.874.404l3.97-4.754c.26-.312.029-.775-.389-.775H6.802l1.68-3.62c.146-.315-.095-.67-.455-.67Z"
                ></path>
              </svg>
              <p>20% off</p>
            </div>
          )}
        </div>
        {subscription.plan === PLAN.ADVANCED &&
        subscription.interval ===
          (activeTab === 'annually' ? 'year' : 'month') ? (
          <Button className="!pointer-events-none !text-black !text-lg !border-transparent !h-14 btn-primary !bg-orange-400  active:translate-y-[0.0625rem] active:transform active:!bg-orange-500 disabled:active:translate-y-0 disabled:text-neutral-900 disabled:shadow-none disabled:cursor-default translate-y-0 [transition:color_500ms,background-color_500ms,border-color_500ms,text-decoration-color_500ms,fill_500ms,stroke_500ms,transform] disabled:opacity-50 dark:disabled:opacity-30 dark:disabled:text-background bg-primary-500 text-background hover:bg-primary-400 hover:shadow-[0_4px_15px_rgba(107,109,216,0.35)] dark:bg-primary-500 dark:text-background dark:hover:bg-primary-400 disabled:bg-neutral-100 dark:disabled:bg-neutral-700 rounded-xl px-5 py-3  mt-6 w-full [.modal_&]:hidden">
            Active
          </Button>
        ) : subscription.plan === PLAN.ADVANCED ? (
          <Button
            className="!text-black !text-lg !border-transparent !h-14 btn-primary !bg-amber-400  active:translate-y-[0.0625rem] active:transform active:!bg-orange-500 disabled:active:translate-y-0 disabled:text-neutral-900 disabled:shadow-none disabled:cursor-default translate-y-0 [transition:color_500ms,background-color_500ms,border-color_500ms,text-decoration-color_500ms,fill_500ms,stroke_500ms,transform] disabled:opacity-50 dark:disabled:opacity-30 dark:disabled:text-background bg-primary-500 text-background hover:bg-primary-400 hover:shadow-[0_4px_15px_rgba(107,109,216,0.35)] dark:bg-primary-500 dark:text-background dark:hover:bg-primary-400 disabled:bg-neutral-100 dark:disabled:bg-neutral-700 rounded-xl px-5 py-3  mt-6 w-full [.modal_&]:hidden"
            onClick={onChange}
          >
            Change Commitment
          </Button>
        ) : (
          <Button className="!text-black !text-lg !border-transparent !h-14 btn-primary !bg-amber-400  active:translate-y-[0.0625rem] active:transform active:!bg-orange-500 disabled:active:translate-y-0 disabled:text-neutral-900 disabled:shadow-none disabled:cursor-default translate-y-0 [transition:color_500ms,background-color_500ms,border-color_500ms,text-decoration-color_500ms,fill_500ms,stroke_500ms,transform] disabled:opacity-50 dark:disabled:opacity-30 dark:disabled:text-background bg-primary-500 text-background hover:bg-primary-400 hover:shadow-[0_4px_15px_rgba(107,109,216,0.35)] dark:bg-primary-500 dark:text-background dark:hover:bg-primary-400 disabled:bg-neutral-100 dark:disabled:bg-neutral-700 rounded-xl px-5 py-3  mt-6 w-full [.modal_&]:hidden">
            Upgrade
          </Button>
        )}
        <div className="mb-[42px] flex flex-col gap-3 [.modal_&amp;]:mb-0 mt-10">
          <ul className="flex flex-col gap-3">
            {subscription_list['advanced'].rights.map((item) => (
              <li
                key={`advanced_${item.right}`}
                className="flex items-center gap-1.5"
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="size-[18px] stroke-[1.75] text-success-600 dark:text-success-400 [.modal_&amp;]:size-4 [.modal_&amp;]:stroke-[1.5]"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="currentStroke"
                    d="m5 11.25 5.158 5.25L19 7.5"
                  ></path>
                </svg>
                <span className="flex flex-row items-center text-base leading-6 font-normal text-neutral-900 transition-all duration-500 dark:text-background [.modal_&amp;]:text-xs [.modal_&amp;]:font-normal [.modal_&amp;]:leading-6">
                  {item.right}
                  {item.tip && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InformationCircleIcon size={18} className="ml-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-48 text-sm">{item.tip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default function PriceSubscription({ subscription }) {
  const changeCommit = useRef(null);
  const { activeTab, setActiveTab } = useToggleStore();
  const proceedingModalRef = useRef(null);
  const successModalRef = useRef(null);
  const [commitModel, setCommitModel] = useState('');
  const [priceEntity, setPriceEntity] = useState({});

  useEffect(() => {
    const getPrices = async () => {
      const [advancedPlan, standardPlan] = await Promise.all([
        getPricesByProductId(PRODUCT_ID_PLAN.ADVANCED),
        getPricesByProductId(PRODUCT_ID_PLAN.STANDARD),
      ]);
      const priceEntity = convertPricesToPlanObject(advancedPlan, standardPlan);
      setPriceEntity(priceEntity);
    };
    getPrices();
  }, []);

  const onChange = async () => {
    changeCommit.current.showModal();
  };

  const onConfirmChange = async () => {
    changeCommit.current.close();
    setCommitModel('Change Commitment');
    proceedingModalRef.current.showModal();
    await updateSubscription(
      subscription.subscriptionId,
      priceEntity[
        `${subscription.plan}_${
          subscription.interval === 'year' ? 'month' : 'year'
        }`
      ]
    );
    proceedingModalRef.current.close();
    successModalRef.current.showModal();
  };

  const onClose = () => {
    successModalRef.current.close();
  };

  console.log('priceEntity', priceEntity);

  return (
    <div className="flex w-full flex-col">
      <div
        dir="ltr"
        data-orientation="horizontal"
        className="mx-auto flex w-fit flex-col items-center justify-center page"
      >
        <Tabs
          value={activeTab}
          className="w-[400px]"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="annually">
              Annually{' '}
              <span className="text-xs ml-2 rounded-md text-green-600 bg-green-600 bg-opacity-[0.15] px-1">
                -20%
              </span>
            </TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="h-full mt-[50px] lg:mt-[80px] 2xl:mt-[100px] flex w-full flex-col gap-[18px] lg:flex-row lg:flex-wrap [.modal_&amp;]:mt-6 [.modal_&amp;]:h-full [.modal_&amp;]:gap-4">
          <Link href="/">
            <div className="lg:h-[755px] 2xl:h-[805px] bg-background shadow-[0px_10px_20px_rgba(0,0,0,0.05)] transition-all duration-500 dark:bg-neutral-800 dark:shadow-none overflow-hidden rounded-[2.3rem] p-0 mobile:w-full  lg:w-[380px] xl:w-[420px]] 2xl:w-[500px] [.modal_&amp;]:max-h-[471px] [.modal_&amp;]:w-[262px] [.modal_&amp;]:rounded-xl [.modal_&amp;]:shadow-[0px_4px_20px_0px_rgba(0,0,0,0.08)] dark:[.modal_&amp;]:shadow-none">
              <div className="bg-background p-[3rem] shadow-[0px_10px_20px_rgba(0,0,0,0.05)] transition-all duration-500 dark:bg-neutral-800 dark:shadow-none group flex h-full w-full flex-col rounded-2xl [.modal_&amp;]:rounded-[11px]">
                <div className="flex flex-col gap-3 [.modal_&amp;]:gap-2">
                  <div className="flex h-8 items-center justify-between [.modal_&amp;]:h-6">
                    <h3 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold text-neutral-900 transition-all duration-500 dark:text-background [.modal_&amp;]:text-base [.modal_&amp;]:font-semibold">
                      Free
                    </h3>
                  </div>
                </div>
                <p className="block h-16 mt-4 font-normal text-base lg:text-xl 2xl:text-2xl  text-neutral-600 transition-all duration-500 dark:text-neutral-40 [.modal_&amp;]:text-xs">
                  {subscription_list['free'].recommend}
                </p>
                <div className="lg:mt-10 flex items-center gap-2 [.modal_&amp;]:mt-auto">
                  <span className="text-[50px] 2xl:text-[60px] font-semibold leading-[72px] text-neutral-900 transition-all duration-500 dark:text-background [.modal_&amp;]:text-5xl [.modal_&amp;]:leading-[60px]">
                    $0
                  </span>
                  <div className="flex flex-col items-start justify-center">
                    <span className="text-base font-medium text-neutral-600 transition-all duration-500 dark:text-neutral-40 [.modal_&amp;]:text-sm">
                      {activeTab === 'annually' ? '/year' : '/month'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row gap-1 pt-1 text-xs font-medium leading-6 text-primary-700 transition-colors duration-500 dark:text-primary-200 [.modal_&amp;]:text-[11px] [.modal_&amp;]:leading-4">
                  <div className="flex items-center justify-center rounded-lg bg-primary-500 bg-opacity-[0.15] px-2 py-1">
                    <p>&nbsp;</p>
                  </div>
                </div>
                <Button className="lg:mt-10 !h-14 active:translate-y-[0.0625rem] active:transform disabled:active:translate-y-0 disabled:text-neutral-900 disabled:shadow-none disabled:cursor-default translate-y-0 [transition:color_500ms,background-color_500ms,border-color_500ms,text-decoration-color_500ms,fill_500ms,stroke_500ms,transform] disabled:opacity-50 dark:disabled:opacity-30 dark:disabled:text-background bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-background dark:hover:bg-neutral-600 rounded-xl px-5 py-3 !text-lg !border-transparent w-full [.modal_&amp;]:hidden">
                  Play now
                </Button>
                <div className="mb-[42px] flex flex-col gap-3 [.modal_&amp;]:mb-0 mt-10">
                  <ul className="flex flex-col gap-3">
                    {subscription_list['free'].rights.map((item) => (
                      <li
                        key={`free_${item.right}`}
                        className="flex items-center gap-1.5"
                      >
                        <svg
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="size-[18px] stroke-[1.75] text-success-600 dark:text-success-400 [.modal_&amp;]:size-4 [.modal_&amp;]:stroke-[1.5]"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="currentStroke"
                            d="m5 11.25 5.158 5.25L19 7.5"
                          ></path>
                        </svg>
                        <span className="flex flex-row items-center text-base leading-6 font-normal text-neutral-900 transition-all duration-500 dark:text-background [.modal_&amp;]:text-xs [.modal_&amp;]:font-normal [.modal_&amp;]:leading-6">
                          {item.right}
                          {item.tip && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <InformationCircleIcon size={18} className="ml-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-48 text-sm">{item.tip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="cursor-pointer items-center justify-center whitespace-nowrap text-center font-semibold shadow-none outline-none active:translate-y-[0.0625rem] active:transform disabled:active:translate-y-0 disabled:text-neutral-900 disabled:shadow-none disabled:cursor-default translate-y-0 [transition:color_500ms,background-color_500ms,border-color_500ms,text-decoration-color_500ms,fill_500ms,stroke_500ms,transform] disabled:opacity-50 dark:disabled:opacity-30 dark:disabled:text-background bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-background dark:hover:bg-neutral-600 h-10 rounded-[10px] px-4 py-2.5 text-sm mt-[19px] hidden w-full [.modal_&amp;]:inline-flex">
                  Upgrade
                </Button>
              </div>
            </div>
          </Link>
          {subscription.plan === PLAN.STANDARD &&
          subscription.interval ===
            (activeTab === 'annually' ? 'year' : 'month') ? (
            StandardItem(activeTab, subscription_list, subscription)
          ) : subscription.plan === PLAN.STANDARD ? (
            StandardItem(activeTab, subscription_list, subscription, onChange)
          ) : (
            <span
              onClick={() =>
                createCheckoutSession(
                  activeTab === 'annually'
                    ? priceEntity?.standard_year
                    : priceEntity?.standard_month
                )
              }
            >
              {StandardItem(activeTab, subscription_list, subscription)}
            </span>
          )}
          {subscription.plan === PLAN.ADVANCED &&
          subscription.interval ===
            (activeTab === 'annually' ? 'year' : 'month') ? (
            AdvancedItem(activeTab, subscription_list, subscription)
          ) : subscription.plan === PLAN.ADVANCED ? (
            AdvancedItem(activeTab, subscription_list, subscription, onChange)
          ) : (
            <span
              onClick={() =>
                createCheckoutSession(
                  activeTab === 'annually'
                    ? priceEntity?.advanced_year
                    : priceEntity?.advanced_month
                )
              }
            >
              {AdvancedItem(activeTab, subscription_list, subscription)}
            </span>
          )}
        </div>
      </div>

      <dialog id="my_modal_1" className="modal" ref={changeCommit}>
        <div className="modal-box !bg-white text-black">
          <form method="dialog" className="flex items-center">
            <div className="inline-flex w-full items-center justify-start gap-3 text-left font-semibold leading-6 text-xl">
              Change Commitment
            </div>
            <Button className="btn btn-md btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </Button>
          </form>
          <div className="shrink-0 px-4 py-6 sm:p-6 .bg-light-bg .dark:bg-dark-800  undefined false">
            <div className="flex flex-col gap-2">
              <p className="">
                At the end of your billing cycle, your subscription plan will
                automatically renew and update to your newly chosen plan.
              </p>
              <div className="mt-4 flex flex-col gap-1 overflow-hidden">
                <div className="space-y-4 rounded-xl border border-light-200 dark:border-dark-800 bg-light-50 font-medium dark:bg-dark-900 p-4 py-6">
                  <div>
                    <h3>
                      From{' '}
                      <span className="!text-teal-400">
                        {capitalizeFirstLetter(subscription.plan)}{' '}
                        {subscription.interval === 'year'
                          ? 'Annually'
                          : 'Monthly'}
                      </span>
                    </h3>
                    <div
                      className="flex w-full items-center justify-between gap-4"
                      aria-label="line item base price"
                    >
                      <p className="">Base price</p>
                      <p className="font-medium">
                        <span className="">$</span>
                        {
                          PRICE_PLAN[
                            `${subscription.plan}_${subscription.interval}`
                          ]
                        }{' '}
                        / {subscription.interval}
                      </p>
                    </div>
                  </div>
                  <hr className="my-2 border-slate-800" />
                  <div>
                    <h3>
                      To{' '}
                      <span className="!text-teal-400">
                        {capitalizeFirstLetter(subscription.plan)}{' '}
                        {subscription.interval === 'year'
                          ? 'Monthly'
                          : 'Annually'}
                      </span>
                    </h3>
                    <div
                      className="flex w-full items-center justify-between gap-4"
                      aria-label="line item base price"
                    >
                      <p className="">Base price</p>
                      <p className="font-medium">
                        <span className="">$</span>
                        {
                          PRICE_PLAN[
                            `${subscription.plan}_${
                              subscription.interval === 'year'
                                ? 'month'
                                : 'year'
                            }`
                          ]
                        }{' '}
                        / {subscription.interval === 'year' ? 'month' : 'year'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 border border-transparent p-4">
                  <div>
                    <div
                      className="flex w-full items-center justify-between gap-4"
                      aria-label="line due"
                    >
                      <p>
                        Amount due on{' '}
                        <span className="italic">
                          {dayjs.unix(subscription.end).format('MMM DD, YYYY')}
                        </span>
                      </p>
                      <p>
                        <span>$</span>
                        {
                          PRICE_PLAN[
                            `${subscription.plan}_${
                              subscription.interval === 'year'
                                ? 'month'
                                : 'year'
                            }`
                          ]
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sm:pt-2 mt-0 rounded-b-xl bg-light-bg dark:bg-dark-800">
            <div className="flex flex-col-reverse flex-wrap gap-4 xs:flex-row xs:flex-nowrap">
              <Button
                className="!border-[transparent] !outline-none !text-black !bg-amber-400  items-center py-2.5 empty:hidden px-1 w-full font-medium !text-base transition rounded-md"
                onClick={onConfirmChange}
              >
                Confirm Change
              </Button>
            </div>
          </div>
        </div>
      </dialog>
      <dialog id="my_modal_3" className="modal" ref={proceedingModalRef}>
        <div className="modal-box !bg-white text-black">
          <form method="dialog" className="flex items-center">
            <div className="inline-flex w-full items-center justify-start gap-3 text-left font-semibold leading-6 text-xl">
              {commitModel}
            </div>
            <Button className="btn btn-md btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </Button>
          </form>
          <div className="shrink-0 py-4">
            <h2>Processing...</h2>
            <div className="my-2 flex flex-col gap-6 text-left">
              <p>
                Please wait while the payment and change is confirmed. If this
                takes longer than a few minutes, please contact{' '}
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
              <Button className="btn  btn-neutral items-center py-2.5 empty:hidden px-1 w-full font-medium !text-base transition rounded-md buttonActiveRing select-none disabled:bg-opacity-40 disabled:text-light-600 dark:disabled:text-dark-500 disabled:pointer-events-none bg-light-800 dark:bg-dark-700 dark:shadow-button">
                Please wait
              </Button>
            </div>
          </div>
        </div>
      </dialog>
      <dialog id="my_modal_4" className="modal" ref={successModalRef}>
        <div className="modal-box !bg-white text-black">
          <form method="dialog" className="flex items-center">
            <div className="inline-flex w-full items-center justify-start gap-3 text-left font-semibold leading-6 text-xl">
              {commitModel}
            </div>
            <Button className="btn btn-md btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </Button>
          </form>
          <div className="shrink-0 py-4">
            <h2>Success!</h2>
            <div className="my-2 flex flex-col gap-6 text-left">
              <p> Your plan change has been confirmed. </p>
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
              <Button
                className="btn items-center py-2.5 empty:hidden px-1 w-full font-medium !text-base transition rounded-md buttonActiveRing select-none disabled:bg-opacity-40 disabled:text-light-600 dark:disabled:text-dark-500 disabled:pointer-events-none bg-light-800 dark:bg-dark-700 dark:shadow-button"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
