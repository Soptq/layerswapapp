import { ChevronDownIcon, InformationCircleIcon } from '@heroicons/react/outline'
import { Disclosure } from "@headlessui/react";
import Tooltip from './tooltip';
import { SwapFormValues } from './DTOs/SwapFormValues';
import { useSwapDataState } from '../context/swap';

function exchangeFee(values: SwapFormValues): number {
    return values?.currency?.baseObject.exchanges?.find(e => e.exchangeId == values.exchange.baseObject.id)?.fee || 0;
}

function calculateFee(values: SwapFormValues): number {
    let currencyObject = values?.currency?.baseObject;
    let exchangeObject = values?.exchange?.baseObject;

    var exchangeFee = Number(values?.amount?.toString()?.replace(",", ".")) * exchangeObject?.fee_percentage;
    var overallFee = currencyObject?.fee + exchangeFee;

    return overallFee || 0;
}

export default function AmountAndFeeDetails({ swapFormData }: { swapFormData: SwapFormValues }) {

    let fee = swapFormData?.amount ? Number(calculateFee(swapFormData)?.toFixed(swapFormData?.currency?.baseObject?.precision)) : 0;


    let receive_amount = 0;
    let amount = Number(swapFormData?.amount?.toString()?.replace(",", "."));
    let currencyObject = swapFormData?.currency?.baseObject;
    if (amount >= currencyObject?.min_amount) {
        var exFee = exchangeFee(swapFormData);
        var result = amount - fee - exFee;
        receive_amount = Number(result.toFixed(currencyObject.precision));
    }
    return (
        <>
            <div className="mx-auto w-full rounded-lg bg-darkblue-500 p-2">
                <Disclosure>
                    {({ open }) => (
                        <>
                            <Disclosure.Button className="items-center flex w-full relative justify-between rounded-lg p-1.5 text-left text-base font-medium border border-darkblue-500 hover:border-darkblue-100">
                                <span className="font-medium text-pink-primary-300">You will receive</span>
                                <span className="absolute right-9">
                                    {
                                        receive_amount ?
                                            <span className="font-medium text-center strong-highlight">
                                                {receive_amount}
                                                <span>
                                                    {
                                                        ` ${swapFormData?.currency?.name || ""}`
                                                    }
                                                </span>
                                            </span>
                                            : '-'
                                    }

                                </span>
                                <ChevronDownIcon
                                    className={`${open ? 'rotate-180 transform' : ''
                                        } h-4 w-4 text-light-blue`}
                                />
                            </Disclosure.Button>
                            <Disclosure.Panel className="p-2 text-sm">
                                <>
                                    <div className="mt-2 flex flex-col md:flex-row items-baseline justify-between">
                                        <label className="inline-flex font-normal items-center text-pink-primary-300 text-left">
                                            Layerswap Fee
                                            {Tooltip("Layerswap Fee is used to cover the gas costs of relaying and executing your swap on Layerswap.")}
                                        </label>
                                        <span className="font-normal text-center text-white">
                                            {fee.toLocaleString()}
                                            <span>  {swapFormData?.currency?.name} </span>
                                        </span>
                                    </div>
                                    <div className="mt-2 flex flex-col md:flex-row items-baseline justify-between">
                                        <label className="inline-flex font-normal text-pink-primary-300 text-left">
                                            Exchange Fee
                                            {Tooltip("test")}
                                        </label>
                                        <span className="font-normal text-center text-white">
                                            {(() => {
                                                if (swapFormData?.amount && swapFormData?.amount != "") {
                                                    return exchangeFee(swapFormData)
                                                }
                                                return "0";
                                            })()}
                                            <span>  {swapFormData?.currency?.name} {swapFormData?.exchange?.baseObject?.internal_name === "binance" && <span>(Refundable)</span>}</span>
                                        </span>
                                    </div>
                                    <div className="mt-2 flex flex-col md:flex-row items-baseline justify-between">
                                        <label className="block font-normal text-pink-primary-300 text-center">
                                            Estimated Time Of Arrival
                                        </label>
                                        <span className="font-normal text-center text-white">
                                            ~1-2 minutes
                                        </span>
                                    </div>
                                </>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            </div>
        </>
    )
}