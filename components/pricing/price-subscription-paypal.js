'use client';

import { useState, useEffect } from 'react';
import { useToggleStore } from '@/stores/pricing';
import { PLAN } from '@/utils/credit';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import './index.css';
import { InformationCircleIcon } from '@hugeicons/react';
import Script from 'next/script';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PAYPAL_PLANS, PAYPAL_SDK_URL } from '@/utils/const';

import { Tabs, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import PaypalButton from './paypal-button';
import useUserStore from '@/stores/user';

const subscriptionList = {
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

const StandardItem = (activeTab, subscriptionConf, subscription, paypal) => (
  <div className="lg:h-[755px] 2xl:h-[805px] bg-background shadow-[0px_10px_20px_rgba(0,0,0,0.05)] transition-all duration-500 dark:bg-neutral-800 dark:shadow-none  overflow-hidden rounded-[2.3rem] p-0 mobile:w-full lg:w-[264px] xl:w-[350px] 2xl:w-[434px] [.modal_&amp;]:max-h-[471px] [.modal_&amp;]:w-[262px] [.modal_&amp;]:rounded-xl [.modal_&amp;]:shadow-[0px_4px_20px_0px_rgba(0,0,0,0.08)] dark:[.modal_&amp;]:shadow-none">
    <div className="h-full bg-background lg:px-4 lg:py-12 xl:p-12 p-12 shadow-[0px_10px_20px_rgba(0,0,0,0.05)] transition-all duration-500 dark:bg-neutral-800 dark:shadow-none group flex  w-full flex-col rounded-2xl [.modal_&amp;]:rounded-[11px]">
      <div className="flex flex-col gap-3 [.modal_&amp;]:gap-2">
        <div className="flex h-8 items-center justify-between [.modal_&amp;]:h-6">
          <h3 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold text-neutral-900 transition-all duration-500 dark:text-background [.modal_&amp;]:text-base [.modal_&amp;]:font-semibold">
            Standard
          </h3>
        </div>
      </div>
      <p className="block h-16 mt-4 font-normal text-base lg:text-xl 2xl:text-2xl  text-neutral-600 transition-all duration-500 dark:text-neutral-40 [.modal_&amp;]:text-xs">
        {subscriptionConf.recommend}
      </p>
      <div className="lg:mt-10 flex items-center gap-2 [.modal_&amp;]:mt-auto">
        <span className="text-[50px] 2xl:text-[60px] font-semibold leading-[72px] text-neutral-900 transition-all duration-500 dark:text-background [.modal_&amp;]:text-5xl [.modal_&amp;]:leading-[60px]">
          {activeTab === 'year' ? '$96' : '$10'}
        </span>
        <div className="flex flex-col items-start justify-center">
          {activeTab === 'year' && (
            <span className="text-gray-300 text-xl font-medium leading-[30px]  line-through transition-all duration-500 dark:text-primary-200 [.modal_&amp;]:text-lg [.modal_&amp;]:leading-6">
              $120
            </span>
          )}
          <span className="text-base font-medium text-neutral-600 transition-all duration-500 dark:text-neutral-40 [.modal_&amp;]:text-sm">
            {activeTab === 'year' ? '/year' : '/month'}
          </span>
        </div>
      </div>
      <div className="flex flex-row gap-1 2xl:pt-1 text-sm 2xl:text-base font-medium leading-6 text-primary-700 transition-colors duration-500 dark:text-primary-200 [.modal_&amp;]:text-[11px] [.modal_&amp;]:leading-4">
        <div className="mt-4 flex items-center justify-center rounded-lg bg-primary-500 bg-opacity-[0.15] px-2 py-1">
          <p>Billed {activeTab === 'year' ? 'annually' : 'monthly'}</p>
        </div>
        {activeTab === 'year' && (
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
      subscription.interval === activeTab ? (
        <Button className="!pointer-events-none !text-black !text-lg !border-transparent !h-14 btn-primary !bg-orange-400  active:translate-y-[0.0625rem] active:transform active:!bg-orange-500 disabled:active:translate-y-0 disabled:text-neutral-900 disabled:shadow-none disabled:cursor-default translate-y-0 [transition:color_500ms,background-color_500ms,border-color_500ms,text-decoration-color_500ms,fill_500ms,stroke_500ms,transform] disabled:opacity-50 dark:disabled:opacity-30 dark:disabled:text-background bg-primary-500 text-background hover:bg-primary-400 hover:shadow-[0_4px_15px_rgba(107,109,216,0.35)] dark:bg-primary-500 dark:text-background dark:hover:bg-primary-400 disabled:bg-neutral-100 dark:disabled:bg-neutral-700 rounded-xl px-5 py-3  mt-6 w-full [.modal_&]:hidden">
          Active
        </Button>
      ) : subscription.plan === PLAN.STANDARD ? (
        <PaypalButton
          key={PAYPAL_PLANS[activeTab].stardard}
          paypal={paypal}
          planId={PAYPAL_PLANS[activeTab].stardard}
          className="mt-6 !h-14 flex-none"
          isChangePlan={subscription.plan !== 'free'}
        >
          <Button className=" !text-black !text-lg !border-transparent !h-14 btn-primary !bg-amber-400  active:translate-y-[0.0625rem] active:transform active:!bg-orange-500 disabled:active:translate-y-0 disabled:text-neutral-900 disabled:shadow-none disabled:cursor-default translate-y-0 [transition:color_500ms,background-color_500ms,border-color_500ms,text-decoration-color_500ms,fill_500ms,stroke_500ms,transform] disabled:opacity-50 dark:disabled:opacity-30 dark:disabled:text-background bg-primary-500 text-background hover:bg-primary-400 hover:shadow-[0_4px_15px_rgba(107,109,216,0.35)] dark:bg-primary-500 dark:text-background dark:hover:bg-primary-400 disabled:bg-neutral-100 dark:disabled:bg-neutral-700 rounded-xl px-5 py-3 w-full [.modal_&]:hidden">
            Change Commitment
          </Button>
        </PaypalButton>
      ) : (
        <PaypalButton
          key={PAYPAL_PLANS[activeTab].stardard}
          paypal={paypal}
          planId={PAYPAL_PLANS[activeTab].stardard}
          className="mt-6 !h-14 flex-none"
          isChangePlan={subscription.plan !== 'free'}
        >
          <Button className=" !text-black !text-lg !border-transparent !h-14 btn-primary !bg-amber-400  active:translate-y-[0.0625rem] active:transform active:!bg-orange-500 disabled:active:translate-y-0 disabled:text-neutral-900 disabled:shadow-none disabled:cursor-default translate-y-0 [transition:color_500ms,background-color_500ms,border-color_500ms,text-decoration-color_500ms,fill_500ms,stroke_500ms,transform] disabled:opacity-50 dark:disabled:opacity-30 dark:disabled:text-background bg-primary-500 text-background hover:bg-primary-400 hover:shadow-[0_4px_15px_rgba(107,109,216,0.35)] dark:bg-primary-500 dark:text-background dark:hover:bg-primary-400 disabled:bg-neutral-100 dark:disabled:bg-neutral-700 rounded-xl px-5 py-3 w-full [.modal_&]:hidden">
            Upgrade
          </Button>
        </PaypalButton>
      )}

      <div className="mb-[42px] flex flex-col gap-3 [.modal_&amp;]:mb-0 mt-10">
        <ul className="flex flex-col gap-3">
          {subscriptionConf.rights.map((item) => (
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

const AdvancedItem = (activeTab, subscriptionConf, subscription, paypal) => (
  <div className="relative mt-12 lg:mt-0">
    <div className="font-medium absolute left-0 bg-violet-500 text-white w-full -top-8 2xl:-top-12  text-center h-32 text-lg 2xl:text-xl leading-[2rem] 2xl:leading-[3rem] rounded-[1.25rem]">
      Best value
    </div>
    <div className="relative lg:h-[755px] 2xl:h-[805px] border-4 border-solid border-violet-500 bg-background shadow-[0px_10px_20px_rgba(0,0,0,0.05)] transition-all duration-500 dark:bg-neutral-800 dark:shadow-none  overflow-hidden rounded-[2.3rem] p-0 mobile:w-full lg:w-[264px] xl:w-[350px] 2xl:w-[434px] [.modal_&amp;]:max-h-[471px] [.modal_&amp;]:w-[262px] [.modal_&amp;]:rounded-xl [.modal_&amp;]:shadow-[0px_4px_20px_0px_rgba(0,0,0,0.08)] dark:[.modal_&amp;]:shadow-none">
      <div className="h-full bg-background lg:px-4 lg:py-12 xl:p-12 p-12 shadow-[0px_10px_20px_rgba(0,0,0,0.05)] transition-all duration-500 dark:bg-neutral-800 dark:shadow-none group flex  w-full flex-col rounded-2xl [.modal_&amp;]:rounded-[11px]">
        <div className="flex flex-col gap-3 [.modal_&amp;]:gap-2">
          <div className="flex h-8 items-center justify-between [.modal_&amp;]:h-6">
            <h3 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold text-neutral-900 transition-all duration-500 dark:text-background [.modal_&amp;]:text-base [.modal_&amp;]:font-semibold">
              Advanced
            </h3>
          </div>
        </div>
        <p className="block h-16 mt-4 font-normal text-base lg:text-xl 2xl:text-2xl  text-neutral-600 transition-all duration-500 dark:text-neutral-40 [.modal_&amp;]:text-xs">
          {subscriptionConf.recommend}
        </p>
        <div className="lg:mt-10 flex items-center gap-2 [.modal_&amp;]:mt-auto">
          <span className="text-[50px] 2xl:text-[60px] font-semibold leading-[72px] text-neutral-900 transition-all duration-500 dark:text-background [.modal_&amp;]:text-5xl [.modal_&amp;]:leading-[60px]">
            {activeTab === 'year' ? '$144' : '$15'}
          </span>
          <div className="flex flex-col items-start justify-center">
            {activeTab === 'year' && (
              <span className="text-gray-300  text-xl font-medium leading-[30px]  line-through transition-all duration-500 dark:text-primary-200 [.modal_&amp;]:text-lg [.modal_&amp;]:leading-6">
                $180
              </span>
            )}
            <span className="text-base font-medium text-neutral-600 transition-all duration-500 dark:text-neutral-40 [.modal_&amp;]:text-sm">
              {activeTab === 'year' ? '/year' : '/month'}
            </span>
          </div>
        </div>
        <div className="flex flex-row gap-1 2xl:pt-1 text-sm 2xl:text-base font-medium leading-6 text-primary-700 transition-colors duration-500 dark:text-primary-200 [.modal_&amp;]:text-[11px] [.modal_&amp;]:leading-4">
          <div className="mt-4 flex items-center justify-center rounded-lg bg-primary-500 bg-opacity-[0.15] px-2 py-1">
            <p>Billed {activeTab === 'year' ? 'annually' : 'monthly'}</p>
          </div>
          {activeTab === 'year' && (
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
        subscription.interval === activeTab ? (
          <Button className="!pointer-events-none !text-black !text-lg !border-transparent !h-14 btn-primary !bg-orange-400  active:translate-y-[0.0625rem] active:transform active:!bg-orange-500 disabled:active:translate-y-0 disabled:text-neutral-900 disabled:shadow-none disabled:cursor-default translate-y-0 [transition:color_500ms,background-color_500ms,border-color_500ms,text-decoration-color_500ms,fill_500ms,stroke_500ms,transform] disabled:opacity-50 dark:disabled:opacity-30 dark:disabled:text-background bg-primary-500 text-background hover:bg-primary-400 hover:shadow-[0_4px_15px_rgba(107,109,216,0.35)] dark:bg-primary-500 dark:text-background dark:hover:bg-primary-400 disabled:bg-neutral-100 dark:disabled:bg-neutral-700 rounded-xl px-5 py-3  mt-6 w-full [.modal_&]:hidden">
            Active
          </Button>
        ) : subscription.plan === PLAN.ADVANCED ? (
          <PaypalButton
            key={PAYPAL_PLANS[activeTab].advanced}
            paypal={paypal}
            planId={PAYPAL_PLANS[activeTab].advanced}
            className="mt-6 !h-14 flex-none"
            isChangePlan={subscription.plan !== 'free'}
          >
            <Button className="!text-black !text-lg !border-transparent !h-14 btn-primary !bg-amber-400  active:translate-y-[0.0625rem] active:transform active:!bg-orange-500 disabled:active:translate-y-0 disabled:text-neutral-900 disabled:shadow-none disabled:cursor-default translate-y-0 [transition:color_500ms,background-color_500ms,border-color_500ms,text-decoration-color_500ms,fill_500ms,stroke_500ms,transform] disabled:opacity-50 dark:disabled:opacity-30 dark:disabled:text-background bg-primary-500 text-background hover:bg-primary-400 hover:shadow-[0_4px_15px_rgba(107,109,216,0.35)] dark:bg-primary-500 dark:text-background dark:hover:bg-primary-400 disabled:bg-neutral-100 dark:disabled:bg-neutral-700 rounded-xl px-5 py-3 w-full [.modal_&]:hidden">
              Change Commitment
            </Button>
          </PaypalButton>
        ) : (
          <PaypalButton
            key={PAYPAL_PLANS[activeTab].advanced}
            paypal={paypal}
            planId={PAYPAL_PLANS[activeTab].advanced}
            className="mt-6 !h-14 flex-none"
            isChangePlan={subscription.plan !== 'free'}
          >
            <Button className="!text-black !text-lg !border-transparent !h-14 btn-primary !bg-amber-400  active:translate-y-[0.0625rem] active:transform active:!bg-orange-500 disabled:active:translate-y-0 disabled:text-neutral-900 disabled:shadow-none disabled:cursor-default translate-y-0 [transition:color_500ms,background-color_500ms,border-color_500ms,text-decoration-color_500ms,fill_500ms,stroke_500ms,transform] disabled:opacity-50 dark:disabled:opacity-30 dark:disabled:text-background bg-primary-500 text-background hover:bg-primary-400 hover:shadow-[0_4px_15px_rgba(107,109,216,0.35)] dark:bg-primary-500 dark:text-background dark:hover:bg-primary-400 disabled:bg-neutral-100 dark:disabled:bg-neutral-700 rounded-xl px-5 py-3 w-full [.modal_&]:hidden">
              Upgrade
            </Button>
          </PaypalButton>
        )}
        <div className="mb-[42px] flex flex-col gap-3 [.modal_&amp;]:mb-0 mt-10">
          <ul className="flex flex-col gap-3">
            {subscriptionConf.rights.map((item) => (
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
  const { activeTab, setActiveTab } = useToggleStore();
  const [paypal, setPaypal] = useState(null);
  const userInfo = useUserStore(state => state.userInfo);
  const [paypalLoaded, setPaypalLoaded] = useState(false)

  useEffect(() => {
    if (window.paypal && userInfo) {
      setPaypal(window.paypal);
    }
  }, [userInfo, paypalLoaded]);

  return (
    <div className="flex w-full flex-col">
      <Script
        onLoad={() => {
          setPaypalLoaded(true);
        }}
        src={PAYPAL_SDK_URL}
      />
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
            <TabsTrigger value="year">
              Annually{' '}
              <span className="text-xs ml-2 rounded-md text-green-600 bg-green-600 bg-opacity-[0.15] px-1">
                -20%
              </span>
            </TabsTrigger>
            <TabsTrigger value="month">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="h-full mt-[50px] lg:mt-[80px] 2xl:mt-[100px] flex w-full flex-col gap-[18px] lg:flex-row lg:flex-wrap [.modal_&amp;]:mt-6 [.modal_&amp;]:h-full [.modal_&amp;]:gap-4">
          <Link href="/">
            <div className="lg:h-[755px] 2xl:h-[805px] bg-background shadow-[0px_10px_20px_rgba(0,0,0,0.05)] transition-all duration-500 dark:bg-neutral-800 dark:shadow-none overflow-hidden rounded-[2.3rem] p-0 mobile:w-full  lg:w-[264px] xl:w-[350px] 2xl:w-[434px] [.modal_&amp;]:max-h-[471px] [.modal_&amp;]:w-[262px] [.modal_&amp;]:rounded-xl [.modal_&amp;]:shadow-[0px_4px_20px_0px_rgba(0,0,0,0.08)] dark:[.modal_&amp;]:shadow-none">
              <div className="bg-background lg:px-4 lg:py-12 xl:p-12 p-12 shadow-[0px_10px_20px_rgba(0,0,0,0.05)] transition-all duration-500 dark:bg-neutral-800 dark:shadow-none group flex h-full w-full flex-col rounded-2xl [.modal_&amp;]:rounded-[11px]">
                <div className="flex flex-col gap-3 [.modal_&amp;]:gap-2">
                  <div className="flex h-8 items-center justify-between [.modal_&amp;]:h-6">
                    <h3 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold text-neutral-900 transition-all duration-500 dark:text-background [.modal_&amp;]:text-base [.modal_&amp;]:font-semibold">
                      Free
                    </h3>
                  </div>
                </div>
                <p className="block h-16 mt-4 font-normal text-base lg:text-xl 2xl:text-2xl  text-neutral-600 transition-all duration-500 dark:text-neutral-40 [.modal_&amp;]:text-xs">
                  {subscriptionList['free'].recommend}
                </p>
                <div className="lg:mt-10 flex items-center gap-2 [.modal_&amp;]:mt-auto">
                  <span className="text-[50px] 2xl:text-[60px] font-semibold leading-[72px] text-neutral-900 transition-all duration-500 dark:text-background [.modal_&amp;]:text-5xl [.modal_&amp;]:leading-[60px]">
                    $0
                  </span>
                  <div className="flex flex-col items-start justify-center">
                    <span className="text-base font-medium text-neutral-600 transition-all duration-500 dark:text-neutral-40 [.modal_&amp;]:text-sm">
                      {activeTab === 'year' ? '/year' : '/month'}
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
                    {subscriptionList['free'].rights.map((item) => (
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
                                  <InformationCircleIcon
                                    size={18}
                                    className="ml-4"
                                  />
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
          </Link>
          {StandardItem(
            activeTab,
            subscriptionList.standard,
            subscription,
            paypal
          )}
          {AdvancedItem(
            activeTab,
            subscriptionList.advanced,
            subscription,
            paypal
          )}
        </div>
      </div>
    </div>
  );
}
