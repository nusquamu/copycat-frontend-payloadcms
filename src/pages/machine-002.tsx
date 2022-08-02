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
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCuAbALgSwMqbAAcAxAewCdkA6MAOwPO1qgAUBDATzDAGIBhAPIA5YgEkASgFkA+iwCCATQCiSxKEKlY2HKVpqQAD0QBaACwBGAGxUAHAFYAzDYCcAdkseATOec3TAGhAOEwsABipzULto01DQyzsbBwSAXxTAtCw8AhIKajoGJigAETYCHgAhOT4AaX0NLR09JEMTO3MHKkTQhztTSxtPUwtzQOCEY09LZypQ1084vvM7b1NnNIyMHHwiMkoaejBGZlLywREJGWK5ABVVFobtbF19IwnY8Ncbc2H2509Eq47GMTOZ5lQHA5zJ4FqFoe5-hsQJltjk9tQAMa6ABm2EoRSo2Ag6F45zEUnqmieLxab2Mdlc5i6vm+jmcdiiyxBCB+nWc5h+nnmiUsplcDlMSJR2V2eSoWNouPxzEJxN4VVqlMaz2aoDpy06A0h8wczjhQw63OMy08tjWAxsCWcphsSRsUq2Mty+wVSuQBNgqAARv7MDhmDwILowITaAA3UgAaxj0p23sxOLx-pVgZD2nDUAQTATGLKOoA2qEALpa6m61rvOZdOJgxIuSzzZyWbm9cLfAWms12DvDD1ZNPo+WZ5VQKi50MFnhHcgUKiEdBlbFy1NouW+rMB4MLopF+OkUtNSs1h5UpqvUE+CExBLLNm9YFBRACuy2DnOhw9CsiR9GOqKyj607ZlAkbRnOmBlCmnoTnukFFLWd60g+TKmJ4ErRPyPS9EC3IuuE5rQssrhAu07pIrQpAQHA+g7uB+SHMcrCcNw6E6veExOOEyyiokniutErjOFaf5UAkYqhGJ3xOJYDigV6k4FEcRSnGAPE0nqJgOECVBDDYVHxP8UTTFaQo-vJUQAkKyymMaqnIRBioHiqRIkrp9Z0jhNjGZYcI+PaQyeNyomzGKpnzD8awLOYrm7u5fqHnmYZoTe2p6Q2ZhCrMromRYgzQhK3I+Lawx+E4FhmuYSSuMlrFTh5M5Tsg65gAQvl8daEq2ACzkJOaEoeD27izEKzh4QCDV+E16TIkhKUZm1UG9ZhEx2OyzKuga7Kch+4xmHyCymRyySGV8jrNemc6oBiGJwPA2V1n1hk-uKrqmspDL-Ek3LtF9AxuNMZqWA1kpLSx6abfpEyQzMO37WyHLA1J3wybh-QCqEZryXYaRpEAA */
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
