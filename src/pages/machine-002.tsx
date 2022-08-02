import { assign, createMachine } from 'xstate';
import { useMachine } from '@xstate/react';

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
    /** @xstate-layout N4IgpgJg5mDOIC5SwC4EMVgAwEYsH0AnAewGMBrMTMQgMWMIFsA6VDbAJgLADtNCAljygAlMpWqEAxAFEAajIByAFSwcc+AMIB5RbQCSIgLL4R2zQGkZymTJGJQAB2KwBKAcR4OQAD0QBaAGYAVgB2ZjCADkDA0MCOADYEmMCAGhAATwDAyPCcUIBOHGDI4MCCyNycAF9q9LZMXAISCiowGnomVnRGwO4+GiEoABF2KTAAN14ULECNACEAQUtvZ1d3T28-BCCcZlDKnKwCgo4C4ISCgBZg9KydwIS9k9COdQPSnDPg2vqe7DwRHEbQ6DBYDWwfXw00GwlGmFkChUsw4Wl0BmM+GGixsqxcbg8XiQvmyXGYOCubwKuCuCWCWCwCTuARwOEC5NCOASoR5VyuPIK5V+IAhTSBrUknXB-ywVwIpE8ADMBEwht12Fh6fgFTxlarhPgBBAADZgRFKVTBDQ6PSGEyLAAyDrx60JW2ybOYfQ4oRKwWpkUFyWZCB9e2CJQpBVCdIKl0CwtFgJaEnadDB6sacu1SpVjDVoq1Or1+YNRtN5uRVvwSxWxLWBM2xO2BX2V0DkQ4YXbEeOOBD-j5zEqgqqWEDSQqCUTMuTwMlGdF2eLeYLMoS8tz+qg+FgAFcAEb5lDuYRSCCeMDMIQTYiUTMA5rztNSh+yze61fCN8bnOf7e7oex6nlACA3mQGCEgA2lgAC6LqNkSoDbLswTDpE44JHywR8hutyZIgVpYMwtKMlyszRhwM4anOEovouMrLlupZQD+H4lkMgFHm4IHjIQJCEMwjjGhgioMTRT50aCXRLuxX6saKv4rgB+7cSeQxgTwt6kJBngwfB9b4hsSEkjsZRetGsz+hcnYvCG8R7JcCQcBhVwVJUfLUY0tGptJ0oakx-4seel4Pm+PkgumMmMXJ24IcZ7o7F2HDMIKgRXDE2FFE8IYYcRJQBl8uAcO2BS1HUIA8MQEBwN4SaSb5UX+Y0XDQgMgjCGIUmEPFbrNtkbnMD6YRxnG8TxEkA70mhFz+lynJqJU04VfV4qNa+opQjCHUjOwvVNsh2SyswdLvFyCS5IykRXAOHDxMOEavIktLfJ2XmPmtkUbTFf4cd+haxSxhommA+0mShIStqd83XfScYxiGeBoTg2WUpqxSXDy71iimX3iVmgNrhqSnMZxqnAUMYOJUEjxehcMbqGjPo3QRCCxAkw4vE8IQuay1zYxFC7RQFhP-TKoSizuCqMMJbRU-1DwYeSFwZc5ZyJAUIZYcRkT5MNY2apUAsNXjwsE798ny4dOxylcytYY8VIa-Z7JvC51zHLruslMbn1C812AYYBpCkHA8CGa6B2mUEsxDaEGUxFyzPFCGpxoZSZzJGosQhMtfwSX79FMFb0eUpE9uq07lxTTyETpUktLJNyF3ldUQA */
    createMachine<
        MultiStepFormMachineContext,
        MultiStepFormMachineEvent
    >(
        {
  id: "state010_rocketeerForm",
  initial: "state020_enteringRocketeer",
  states: {
    state020_enteringRocketeer: {
      description: "Enter relevent information about applicant",
      on: {
        EVENT021_CONFIRM_ROCKETEER: {
          actions: "action001_assignRocketeerInfoToContext",
          description: "Confirm applicant's details are correct",
          target: "state030_enteringDate",
        },
      },
    },
    state030_enteringDate: {
      description: "Select date of launch",
      on: {
        event031_BACK: {
          description: "Go back to applicant details, something incorrect",
          target: "state020_enteringRocketeer",
        },
        EVENT032_CONFIRM_DATE: {
          actions: "assignDateToContext",
          description: "Confirm date is correct",
          target: "state040_confirming",
        },
      },
    },
    state040_confirming: {
      initial: "state050_confirming_idle",
      states: {
        state050_confirming_idle: {
          exit: "clearErrorMessage",
          description: "At the confirmation stage, awaiting 3rd party sign-off",
          on: {
            EVENT051_CONFIRM_ALL: {
              description: "Verify that everything is good",
              target: "state060_confirming_submitting",
            },
            EVENT051_BACK: {
              description:
                "Return from `idle` in `confirming`, perhaps 3rd party rejected or didn't get back in time",
              target: "#state010_rocketeerForm.state030_enteringDate",
            },
          },
        },
        state060_confirming_submitting: {
          invoke: {
            src: "EVENT061_SUBMIT",
            onDone: [
              {
                description: "Confirm complete and submit application",
                target: "state070_confirming_complete",
              },
            ],
            onError: [
              {
                actions: "assignErrorMessageToContext",
                target: "state050_confirming_idle",
              },
            ],
          },
        },
        state070_confirming_complete: {
          description:
            "Confirming everything is sorted (might need external sign-off)",
          type: "final",
        },
      },
      onDone: {
        description: "Application complete",
        target: "state080_success",
      },
    },
    state080_success: {
      description: "All done, ship it and grab a beer",
      type: "final",
    },
  },
},
        {
            services: { submitPayment: () => () => { } },
            actions: {
                assignDateToContext: assign((_context, event) => {
                    if (event.type !== 'CONFIRM_DATE') return {};
                    return {
                        dateInfo: event.info,
                    };
                }),
                assignPayeeInfoToContext: assign((_context, event) => {
                    if (event.type !== 'CONFIRM_PAYEE') return {};
                    return {
                        payeeInfo: event.info,
                    };
                }),
                assignErrorMessageToContext: assign((_context, event: any) => {
                    return {
                        errorMessage: event.data?.message || 'An unknown error occurred',
                    };
                }),
                clearErrorMessage: assign((_context, _event: any) => {
                    return {
                        errorMessage: undefined,
                    };
                }),

                // clearErrorMessage: assign({
                //     errorMessage: undefined,
                // }),
            },
        },
    );





















import { createStyles, ThemeIcon, Progress, Text, Group, Badge, Paper, Container, Button, Title } from '@mantine/core';
import { IconSwimming } from '@tabler/icons';

const ICON_SIZE = 60;

const useStyles = createStyles((theme) => ({
    card: {
        position: 'relative',
        overflow: 'visible',
        padding: theme.spacing.xl,
        paddingTop: theme.spacing.xl * 1.5 + ICON_SIZE / 3,
    },

    icon: {
        position: 'absolute',
        top: -ICON_SIZE / 3,
        left: `calc(50% - ${ICON_SIZE / 2}px)`,
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        lineHeight: 1,
    },
}));


const MultiStepFormMachineComponentStatsCard = () => {
    // export function StatsCard() {
    const [state, send] = useMachine(multiStepFormMachine);

    const { classes } = useStyles();



    return (
        <Container>

            <Container
                size={'sm'}
            >
                <Paper
                    radius="md"
                    withBorder
                    className={classes.card}
                    mt={ICON_SIZE / 1.5}
                >
                    <ThemeIcon
                        className={classes.icon}
                        size={ICON_SIZE}
                        radius={ICON_SIZE}
                    >
                        <IconSwimming
                            size={34}
                            stroke={1.5}
                        />
                    </ThemeIcon>

                    <Title order={1} align='center' >Multi-step form machine component</Title>

                    <Title order={2} align='center' ><Badge size="xl">State: {state.value.toString()}</Badge></Title>


                    <Group
                        position="apart"
                        mt="xs"
                    >
                        <Text
                            size="sm"
                            color="dimmed"
                        >
                            Progress
                        </Text>
                        <Text
                            size="sm"
                            color="dimmed"
                        >
                            62%
                        </Text>
                    </Group>

                    <Progress
                        value={62}
                        mt={5}
                    />

                    <Group
                        position="apart"
                        mt="md"
                    >
                        <Text size="sm">20 / 36 km</Text>
                        <Badge size="sm">4 days left</Badge>
                    </Group>




                    {
                        state.matches("enteringPayee") &&
                        <div>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio eius labore nisi tempore modi vel voluptate ullam nostrum adipisci suscipit eaque quae cupiditate, accusamus minus laboriosam totam laborum, deserunt sint.
                            </p>

                            <Button
                                onClick={() => send("CONFIRM_PAYEE")}
                                radius="md"
                            >
                                Confirm
                            </Button>
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
                                <Button
                                    onClick={() => send("BACK")}
                                >
                                    Back
                                </Button>

                                <Button>
                                    Dunno
                                </Button>

                                <Button
                                    onClick={() => send("CONFIRM_DATE")}
                                >
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    }






                </Paper>

            </Container>


            <iframe src="https://stately.ai/viz/embed/e7109c2c-7048-4d67-85c2-02ad402bf1a6?mode=viz&panel=code&showOriginalLink=1&readOnly=1&pan=1&zoom=2&controls=1" sandbox="allow-same-origin allow-scripts"

                width={'100%'}
                height={500}
                frameBorder={0}
                style={{ marginTop: 20 }}

            ></iframe>

        </Container>
    );
}













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
                            <button
                                onClick={() => send("CONFIRM_PAYEE")}
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
                                <button
                                    onClick={() => send("BACK")}
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

                                <button
                                    onClick={() => send("CONFIRM_DATE")}
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

            <img
                src={'https://stately.ai/registry/machines/e7109c2c-7048-4d67-85c2-02ad402bf1a6.png'}
                alt={'asdf'}
            />

        </div>
    );
}

export default MultiStepFormMachineComponentStatsCard;
