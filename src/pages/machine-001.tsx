import { createMachine } from "xstate";
import { useMachine } from "@xstate/react";

const promiseMachine =
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AtgS1mAdMmAHYTbFQDEASgKIDKA8gDIBqtiK6s2ALtumKcQAD0QAWAAz5Jk8fIBMARkkBmABwB2JevEAaEAE9EAWgUA2fOICcq1QFZ1q8TvULxAXw8G0WXASJScio6AClaAGEAFWFkbj4BISRRCWlZeXFlNS0dfSMJBStza3N1FU1ZVWtxdXsvbxBidAg4WIwcPEISMgpY+P5BYTEEE01CjVd1a00yuXV1A2MR9xlJCutrJWsLZ08G3w6CVDh0ABsAN0g+ngGk0GGlcyV8a3s5e3MNORVJc0XTVSFGzWNSqSSbcz2FyqLw+dr+fDHABWYAAxrwrsk4jdEkNEI9nq93p91N9ZH98ghVJZxOYpHJNF9JApHOZYSADv5rglBslhiYSvgJvMpjMVDUFpSTOKipo5eZmWs6U56h4gA */
    createMachine({
        id: "promise",
        initial: "pending",
        states: {
            pending: {
                on: {
                    RESOLVE: {
                        target: "resolved",
                    },
                    REJECT: {
                        target: "rejected",
                    },
                },
            },
            resolved: {
                type: "final",
            },
            rejected: {
                type: "final",
            },
        },
    });


const SimpleMachineComponent = () => {
    const [state, send] = useMachine(promiseMachine);

    console.log(state.value);

    return (

        <>
            <div className="m-40">

                <div className="relative block p-8 border border-teal-800 shadow-xl rounded-xl" >

                    <div className="mt-4 sm:pr-8">
                        <svg
                            className="w-8 h-8 sm:w-10 sm:h-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                            ></path>
                        </svg>

                        <h3 className="my-4">State of the machine:</h3>

                        {
                            state.matches("pending") &&
                            <div className="p-4 alert-info">
                                {state.value}
                            </div>
                        }

                        {
                            state.matches("resolved") &&
                            <div className="p-4 alert-success">
                                {state.value}
                            </div>
                        }

                        {
                            state.matches("rejected") &&
                            <div className="p-4 alert-error">
                                {state.value}
                            </div>
                        }

                        {
                            state.matches("pending") &&
                            <div className="inline-flex items-center -space-x-px text-xs rounded-md mt-4 mx-auto sm:pr-8">
                                <button onClick={() => send("RESOLVE")}
                                    className="px-5 py-3 border rounded-l-md hover:z-10 focus:outline-none focus:border-indigo-600 focus:z-10 hover:alert-success"
                                    type="button"
                                >
                                    Resolve
                                </button>

                                <button
                                    className="px-5 py-3 font-medium border hover:z-10 focus:outline-none focus:border-indigo-600 focus:z-10 hover:alert-info active:opacity-75"
                                    type="button"
                                >
                                    Dunno
                                </button>

                                <button onClick={() => send("REJECT")}
                                    className="px-5 py-3 font-medium border rounded-r-md hover:z-10 focus:outline-none focus:border-indigo-600 focus:z-10 hover:alert-error active:opacity-75"
                                    type="button"
                                >
                                    Reject
                                </button>
                            </div>
                        }


                    </div>
                </div>

            </div>

        </>
    );
}


export default SimpleMachineComponent;
