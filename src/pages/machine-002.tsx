import { assign, createMachine } from 'xstate';
import { useMachine } from "@xstate/react";

export interface MultiStepFormMachineContext {
    payeeInfo?: PayeeInfo;
    dateInfo?: DateInfo;
    errorMessage?: string;
}

interface PayeeInfo {
    name: string;
    amount: number;
    currency: string;
}

interface DateInfo {
    preferredData: string;
}

export type MultiStepFormMachineEvent =
    | {
        type: 'BACK';
    }
    | {
        type: 'CONFIRM_PAYEE';
        info: PayeeInfo;
    }
    | {
        type: 'CONFIRM_DATE';
        info: DateInfo;
    }
    | {
        type: 'CONFIRM';
    };

const multiStepFormMachine =
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCuAbALgSwMqbAAcAxAewCdkA6MAOwPO1qgAUBDATzDAGIBhAPIA5YgEkASgFkA+iwCCATQCiSxKEKlY2HKVpqQAD0QAmAAwBmKsYBsATgCMAVgDsAFlO3r157ecAaEA5EbwAOK3NXeztQ+wtrAF94gLQsPAISCmo6BiYoABE2Ah4AITk+AGl9DS0dPSRDRHsQ0ytrc0dXV2dTRxtrEICghHsIqkdTHu9Y8xtzc0TkjBx8IjJKGnowRmYCosERCRk8uQAVVXrq7WxdfSMELzCQ52d7Pttbc3t7QcavK2MnMZnMZOiFXCCEkkQClluk1tQAMa6ABm2EouSo2Ag6F4+zEUiqmiuN3qd2sxmMVHJ1nsrgeM1svR+CEcbSoL3a5M8vmsjlsC2hSzSq0yVCRtFR6OYmOxvFKFUJNWudVAd0coxCTmsnXM5JCIVsxmZdOsVDmAO6TXctNZAphwoy63FkuQGNgqAARq7MDhmDwILowJjaAA3UgAayD9pWjsRKLRrul7q92l9UAQTDDCMKyoA2qYALqK4kqhrDUydKjvGamYFuEK9RzMmnOKgTVzNaa+TX8qHRuGi50Jt2e71pnhbcgUKiEdCFZGi-sip3xqVQKjJse5DOh0jZ2r5osXIm1W6IRn2KuG2yainNJ7WY0gs21gGmEGvOz2O1CmPwsWromUD+oGG6YIUUa-gOK4SsOzDFqepKNCCLQzCMvQ3sCTT+IEiCuA4VDgvYtiuLqxFtJ4jiJFCtCkBAcD6EusYbDkzDsFwYAIcqZ4IKYzYdlQtKRJ0wLvCE7Q-qkf6itkWy5LsnHHkqJKqiY5ituYHiuC45LmCExgfMaTiEb4cy9NY76zFRfZQcucawWuMo4lxKllo4LitOYjLgrYpj6iMRlhKyjgGh0rxgr4kmwnZAEOUBG6jqmuQuaWdzOL0VANu8IL6ZyzKsrYVZPA4EQOF+UUOv+Q6OUiyCzmABApTxIxRFYvTGOpfLdj0zaxCZDj2M4Fkdv08w2VJ0H2S6yVKSWPHqpYszeQZfmauYzIRKafIvG46X3h2FXSes7oIgicDwLNiGqcMFKXulFkhcRziaWCzYTIJnRCaJN4SeN0Wxk1SEIAAtCCzaUuqTQgsCQK5d+1FAA */
    createMachine<
        MultiStepFormMachineContext,
        MultiStepFormMachineEvent
    >(
        {
            id: "multiStepForm",
            initial: "enteringPayee",
            states: {
                enteringPayee: {
                    on: {
                        CONFIRM_PAYEE: {
                            actions: "assignPayeeInfoToContext",
                            target: "enteringDate",
                        },
                    },
                },
                enteringDate: {
                    on: {
                        BACK: {
                            target: "enteringPayee",
                        },
                        CONFIRM_DATE: {
                            actions: "assignDateToContext",
                            target: "confirming",
                        },
                    },
                },
                confirming: {
                    initial: "idle",
                    states: {
                        idle: {
                            exit: "clearErrorMessage",
                            on: {
                                CONFIRM: {
                                    target: "submitting",
                                },
                                BACK: {
                                    target: "#multiStepForm.enteringDate",
                                },
                            },
                        },
                        submitting: {
                            invoke: {
                                src: "submitPayment",
                                onDone: [
                                    {
                                        target: "complete",
                                    },
                                ],
                                onError: [
                                    {
                                        actions: "assignErrorMessageToContext",
                                        target: "idle",
                                    },
                                ],
                            },
                        },
                        complete: {
                            type: "final",
                        },
                    },
                    onDone: {
                        target: "success",
                    },
                },
                success: {
                    type: "final",
                },
            },
        },
        {
            services: { submitPayment: () => () => { } },
            actions: {
                assignDateToContext: assign((context, event) => {
                    if (event.type !== 'CONFIRM_DATE') return {};
                    return {
                        dateInfo: event.info,
                    };
                }),
                assignPayeeInfoToContext: assign((context, event) => {
                    if (event.type !== 'CONFIRM_PAYEE') return {};
                    return {
                        payeeInfo: event.info,
                    };
                }),
                assignErrorMessageToContext: assign((context, event: any) => {
                    return {
                        errorMessage: event.data?.message || 'An unknown error occurred',
                    };
                }),
                clearErrorMessage: assign({
                    errorMessage: undefined,
                }),
            },
        },
    );




const MultiStepFormMachineComponent = () => {
    const [state, send] = useMachine(multiStepFormMachine);

    return (
        <div className='mx-40 my-10'>

            <div className="block px-8 py-4 bg-gray-900 border border-gray-800 shadow-xl rounded-xl" >
                <h2 className="mt-3 text-xl font-bold text-white">Payee input state machine form</h2>

                <strong className="inline-flex items-center border border-gray-200 mt-4 rounded relative px-2.5 py-1.5 ">

                    Status:
                    <span className="text-green-700 ml-1.5">
                        {/* {!state.matches("asdf") && <span className=''>{state.value}</span>} */}
                    </span>
                </strong>

                <div className="mt-4 text-sm text-gray-300">
                    {
                        state.matches("enteringPayee") &&
                        <div>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio eius labore nisi tempore modi vel voluptate ullam nostrum adipisci suscipit eaque quae cupiditate, accusamus minus laboriosam totam laborum, deserunt sint.
                            </p>
                            <button onClick={() => send("CONFIRM_PAYEE")}
                                className="mt-4 inline-block p-[2px] rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:text-white active:text-opacity-75 focus:outline-none focus:ring"
                                type="button"
                            >
                                <span className="block px-8 py-3 rounded-full hover:bg-transparent">
                                    Confirm
                                </span>
                            </button>
                        </div>
                    }

                    {
                        state.matches("enteringDate") &&
                        <div>
                            <p>
                                Bacon ipsum dolor amet chicken t-bone picanha, andouille meatloaf ham hock short ribs meatball pork loin flank tongue brisket. Burgdoggen ham hock rump sirloin biltong. Doner turducken pork loin, beef shank cow sirloin bacon. Leberkas brisket filet mignon chislic. Strip steak sausage bacon tail, flank swine sirloin salami cow fatback shoulder tenderloin picanha corned beef andouille.<br />
                                <br />
                                T-bone doner bresaola chuck. Sirloin alcatra burgdoggen, swine flank chislic meatloaf tri-tip. Pancetta andouille shoulder, meatloaf shankle salami sausage hamburger. Tri-tip andouille shoulder ribeye.
                            </p>
                            <div className="inline-flex items-center -space-x-px text-xs rounded-md mt-4 mx-auto sm:pr-8">
                                <button onClick={() => send("BACK")}
                                    className="px-5 py-3 border rounded-l-md hover:z-10 focus:outline-none focus:border-indigo-600 focus:z-10 hover:alert-success"
                                    type="button"
                                >
                                    Back
                                </button>

                                <button
                                    className="px-5 py-3 font-medium border hover:z-10 focus:outline-none focus:border-indigo-600 focus:z-10 hover:alert-info active:opacity-75"
                                    type="button"
                                >
                                    Dunno
                                </button>

                                <button onClick={() => send("CONFIRM_DATE")}
                                    className="px-5 py-3 font-medium border rounded-r-md hover:z-10 focus:outline-none focus:border-indigo-600 focus:z-10 hover:alert-error active:opacity-75"
                                    type="button"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    }

                </div>
            </div>

        </div>
    );
}

export default MultiStepFormMachineComponent;
