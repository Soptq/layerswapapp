import { useRouter } from 'next/router';
import { FC, useEffect } from 'react'
import { useFormWizardaUpdate, useFormWizardState } from '../../../context/formWizardProvider';
import { useSwapDataUpdate } from '../../../context/swap';
import TokenService from '../../../lib/TokenService';
import { SwapStatus } from '../../../Models/SwapStatus';
import { SwapWizardSteps } from '../../../Models/Wizard';

const OverviewStep: FC= () => {
    const { setLoading: setLoadingWizard, goToStep } = useFormWizardaUpdate<SwapWizardSteps>()
    const { currentStep } = useFormWizardState<SwapWizardSteps>()

    const router = useRouter();
    const { swapId } = router.query;

    const { getSwap } = useSwapDataUpdate()

    useEffect(() => {
        (async () => {
            try {
                if (currentStep == "Overview") {
                    const authData = TokenService.getAuthData();
                    if (!authData) {
                        goToStep("Email")
                        setLoadingWizard(false)
                        return;
                    }
                    const swap = await getSwap(swapId.toString())
                    const { payment } = swap || {};
                    const swapStatus = swap?.status;
                    const paymentStatus = payment?.status
                    if (swapStatus == SwapStatus.Completed)
                        goToStep("Success")
                    else if (swapStatus == SwapStatus.Failed || paymentStatus == 'closed')
                        goToStep("Failed")
                    else if (swapStatus == SwapStatus.Pending)
                        goToStep("Processing")
                    else {
                        if (payment.external_flow_context)
                            goToStep("ExternalPayment")
                        else if (payment.manual_flow_context)
                            goToStep("Withdrawal")
                        else
                            goToStep("Processing")
                    }
                    setTimeout(() => {
                        setLoadingWizard(false)
                    }, 500);
                }
            }
            catch (e) {
                goToStep("Failed")
                setTimeout(() => {
                    setLoadingWizard(false)
                }, 500);
            }

        })()
    }, [swapId, currentStep, router.query])

    return (
        <>
            <div className="w-full px-3 md:px-8 py-12 grid grid-flow-row">
            </div>
        </>
    )
}

export default OverviewStep;