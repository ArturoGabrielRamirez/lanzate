"use client"
import { InteractiveStepper, InteractiveStepperContent, InteractiveStepperDescription, InteractiveStepperIndicator, InteractiveStepperItem, InteractiveStepperSeparator, InteractiveStepperTitle, InteractiveStepperTrigger } from "@/components/expansion/interactive-stepper"

type Props = {}
function OrderSummarySteps({ }: Props) {
    return (
        <InteractiveStepper orientation="horizontal">
            <InteractiveStepperItem completed>
                <InteractiveStepperTrigger>
                    <InteractiveStepperIndicator />
                    <div>
                        <InteractiveStepperTitle>Order Placed</InteractiveStepperTitle>
                        <InteractiveStepperDescription>
                            Your order has been placed successfully
                        </InteractiveStepperDescription>
                    </div>
                </InteractiveStepperTrigger>
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>
            <InteractiveStepperItem>
                <InteractiveStepperTrigger>
                    <InteractiveStepperIndicator />
                    <div>
                        <InteractiveStepperTitle>Processing</InteractiveStepperTitle>
                        <InteractiveStepperDescription>
                            We are preparing your order
                        </InteractiveStepperDescription>
                    </div>
                </InteractiveStepperTrigger>
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>
            <InteractiveStepperItem>
                <InteractiveStepperTrigger>
                    <InteractiveStepperIndicator />
                    <div>
                        <InteractiveStepperTitle>Shipped</InteractiveStepperTitle>
                        <InteractiveStepperDescription>Your order is on the way</InteractiveStepperDescription>
                    </div>
                </InteractiveStepperTrigger>
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>
            <InteractiveStepperContent step={1}>
                <div>
                    <p>Order Placed</p>
                    <p>Your order has been placed successfully</p>
                </div>
            </InteractiveStepperContent>
        </InteractiveStepper>
    )
}
export default OrderSummarySteps