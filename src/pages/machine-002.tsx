import { assign, createMachine } from 'xstate';
import { useMachine } from '@xstate/react';

export interface MultiStepFormMachineContext {
    rocketeerInfo?: RocketeerInfo;
    dateInfo?: DateInfo;
    errorMessage?: string;
}

interface RocketeerInfo {
    name: string;
    amount: number;
    currency: string;
}

interface DateInfo {
    preferredData: string;
}

export type MultiStepFormMachineEvent =
    | {
        type: 'EVENT031_BACK';
    }
    | {
        type: 'EVENT021_CONFIRM_ROCKETEER';
        info: RocketeerInfo;
    }
    | {
        type: 'EVENT032_CONFIRM_DATE';
        info: DateInfo;
    }
    | {
        type: 'EVENT051_CONFIRM_ALL';
    }
    | {
        type: 'EVENT051_BACK';
    }

const multiStepFormMachine =
    /** @xstate-layout N4IgpgJg5mDOIC5SwC4EMVgAwEYsH0AnAewGMBrMTMQgMWMIFsA6VDbAJgLADtNCAljygAlMpWqEAxAFEAajIByAFSwcc+AMIB5RbQCSIgLL4R2zQGkZymTJGJQAB2KwBKAcR4OQAD0QBaAGYAVgB2ZjCADkDA0MCOADYEmMCAGhAATwDAyPCcUIBOHGDI4MCCyNycAF9q9LZMXAISCiowGnomVnRGwO4+GiEoABF2WQUVLECNACEAQUtvZ1d3T28-BH8cDmZ4jjisABZgw4TEnAv0rM2QncTD3KwEo4Sijlr6nuw8InE2joYLAa2D6+F4-CGo0w4yUqniWl0BmM+GGcxsSxcbg8XiQvmyXGYOEOHA4BVwp2CWCeVwCF0ChNCOASoRZh0OLIK5Q+IGBTV+rUknSBXyOBFIngAZgImEN8AB3NwAC3wgUIEHwjjQhBQGW67CwlPw4p4UplwnwAggABswDDJsENDo9IYTHMADJujErbHrbI4el9fYJfJcSnB0I0hD7cKVZ4cSLqMqU951Hkin4tCTtOiAvWNQ5iyXSxiyhUoZWq9Wa7W63mG42mkvmy02u2qB34eaLXHLLFrXEbArMUIPCocMIPYKUoqR-xs5iVTlVLCRApJCoJbm8jN-QW53kFo1Fs1QeVKlVqjVanV57DPI8m4uy2AAVwARiWUO5hFIIJ4wMwQgAG7EJQt58pm-w5l0B6Fo+J5nuWF5VtetYiveDZPuar4fm435QAgwFkBg2IANpYAAul6fY4qAGxBMUC6RFgRSUpECSHPEaSZIgzzBLsnIFMEHEbpE2xbumzS7tmQrgYemEIWWFaXtWN68hhx5NqeOGfvhUg0CQhDMI4VoYBK+6SfyWYAjBIryZppbnpWV41uBGnwVp+A6XhQyETwIGkCRnjkVRPaYqstF4psJzMAUoSrnF5Rkgk0ShAkkbxIczDBsySSVFgoQksEEn6juAoyRZ+r2R5jlIc5qkZL+-63uBZXWdBwpVXBja1cpKE1tREW+ps478WoxTlCy5TjhGPEIKuWDZSc7FiWoYnJLUqY8MQEBwN425SeVNmdY0XBggMgjCGIR2EINPoDtkhxDvsYRrmuXGJOlc3+JS-HCcERTMng8bsSVjRtVBsm8qC4KDMIUJgHd-Z0dkRxLeojJ5aETyRIcs4cPEC5ToV9xnEJCZg98h3tVDdndVhp5KchLlqSK9YOc21qI2F3rI1FQQA+jTLxccLG5ZGeD8TggPEgaxSvCylMQdJx1yfTilOSpqFuernneV+QxI5F9ExAkuzCWlTwEyOpyRpxOwFsTxS4yET2bqmB1WZDlX5rrvXMw14HYw+PXmuKjAmW0RvDUEzGEsJDwpcGHAFqEwSRnEAa4BxmWnInSsQ3utldSHDOIX1LPXE44X3SjmwFll8uJ+x2yp+nc0xMwJKkuS0YjmJBfU97xeNMxXkvqQpBwPAPM0THfT8YEZycYDUxnMyEu4DsU59Lg8XlEvg9e0XjDRw99fxvHHErcnbezmE4RlKcrwFOyYkE5t1RAA */
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
                        EVENT031_BACK: {
                            description: "Go back to applicant details, something incorrect",
                            target: "state020_enteringRocketeer",
                        },
                        EVENT032_CONFIRM_DATE: {
                            actions: "assignDateToContext",
                            description: "Confirm date is correct",
                            target: "state040_confirming_with_3rd_party",
                        },
                    },
                },
                state040_confirming_with_3rd_party: {
                    initial: "state050_confirming_idle",
                    states: {
                        state050_confirming_idle: {
                            exit: "clearErrorMessage",
                            description: "At the confirmation stage, awaiting 3rd party sign-off",
                            on: {
                                EVENT051_CONFIRM_ALL: {
                                    description:
                                        "Verify that everything is good on both ours and 3rd party side",
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
                            description: "Awaiting to submit application",
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
                                        description:
                                            "Something wrong with the submission - go back a step",
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
                    description: "All done, ship it and sip it",
                    type: "final",
                },
            },
        },
        {
            // services: { submitApplication: () => () => { } },
            actions: {
                assignDateToContext: assign((_context, event) => {
                    if (event.type !== 'EVENT032_CONFIRM_DATE') return {};
                    return {
                        dateInfo: event.info,
                    };
                }),
                assignRocketeerInfoToContext: assign((_context, event) => {
                    if (event.type !== 'EVENT021_CONFIRM_ROCKETEER') return {
                        rocketeerInfo: undefined,
                    };
                    return {
                        rocketeerInfo: event.info,
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

                    <Title
                        order={1}
                        align='center'
                    >Multi-step form machine component</Title>

                    <Title
                        order={2}
                        align='center'
                    ><Badge size="xl">State: {state.value.toString()}</Badge></Title>


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
                        state.matches("enteringRocketeer") &&
                        <div>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio eius labore nisi tempore modi vel voluptate ullam nostrum adipisci suscipit eaque quae cupiditate, accusamus minus laboriosam totam laborum, deserunt sint.
                            </p>

                            <Button
                                onClick={() => send("EVENT021_CONFIRM_ROCKETEER")}
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
                                    onClick={() => send("EVENT031_BACK")}
                                >
                                    Back
                                </Button>

                                <Button>
                                    Dunno
                                </Button>

                                <Button
                                    onClick={() => send("EVENT032_CONFIRM_DATE")}
                                >
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    }






                </Paper>

            </Container>


            <iframe
                src="https://stately.ai/viz/embed/e7109c2c-7048-4d67-85c2-02ad402bf1a6?mode=viz&panel=code&showOriginalLink=1&readOnly=1&pan=1&zoom=2&controls=1"
                sandbox="allow-same-origin allow-scripts"

                width={'100%'}
                height={500}
                frameBorder={0}
                style={{ marginTop: 20 }}

            ></iframe>


            <img
                src={'https://stately.ai/registry/machines/e7109c2c-7048-4d67-85c2-02ad402bf1a6.png'}
                alt={'asdf'}
            />

        </Container>
    );
}


export default MultiStepFormMachineComponentStatsCard;
