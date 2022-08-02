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
    preferredDate: string;
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
    | {
        type: 'EVENT061_SUBMIT';
    }

const multiStepFormMachine =
    /** @xstate-layout N4IgpgJg5mDOIC5SwC4EMVgAwEYsH0AnAewGMBrMTMQgMWMIFsA6VDbAJgLADtNCAljygAlMpWqEAxAFEAajIByAFSwcc+AMIB5RbQCSIgLL4R2zQGkZymTJGJQAB2KwBKAcR4OQAD0QBaAGYAVgB2ZjCADkDA0MCOADYEmMCAGhAATwDAyPCcUIBOHGDI4MCCyNycAF9q9LZMXAISCiowGnomVnRGwO4+GiEoABF2WQUVLECNACEAQUtvZ1d3T28-BH8cDmZ4jjisABZgw4TEnAv0rM2QncTD3KwEo4Sijlr6nuw8InE2joYLAa2D6+F4-CGo0w4yUqniWl0BmM+GGcxsSxcbg8XiQvmyXGYOEOHA4BVwp2CWCeVwCF0ChNCOASoRZh0OLIK5Q+IGBTV+rUknSBXyOBFIngAZgImEN8AB3NwAC3wgUIEHwjjQhBQGW67CwlPw4p4UplwnwAggABswDDJsENDo9IYTHMADJujErbHrbI4el9fYJfJcSnB0I0hD7cKVZ4cSLqMqU951Hkin4tCTtOiAvWNQ5iyXSxiyhUoZWq9Wa7W63mG42mkvmy02u2qB34eaLXHLLFrXEbArMUIPCocMIPYKUoqR-xs5iVTlVLCRApJCoJbm8jN-QW53kFo1Fs1QeVKlVqjVanV57DPI8m4uy2AAVwARiWUO5hFIIJ4wMwQgAG7EJQt58pm-w5l0B6Fo+J5nuWF5VtetYiveDZPuar4fm435QAgwFkBg2IANpYAAul6fY4qAGxBMUC6RFgRSUpECSHPEaSZIgzzBLsnIFMEHEbpE2xbumzS7tmQrgYemEIWWFaXtWN68hhx5NqeOGfvhUg0CQhDMI4VoYBK+6SfyWYAjBIryZppbnpWV41uBGnwVp+A6XhQyETwIGkCRnjkVRPaYqstF4psJzMAUoSrnF5Rkgk0ShAkkbxIczDBsySSVFgoQksEEn6juAoyRZ+r2R5jlIc5qkZL+-63uBZXWdBwpVXBja1cpKE1tREW+ps478WoxTlCy5TjhGPEIKuWDZSc7FiWoYnJLUqY8MQEBwN425SeVNmdY0XBggMgjCGIR2EINPoDtkhxDvsYRrmuXGJOlc3+JS-HCcERTMng8bsSVjRtVBsm8qC4KDMIUJgHd-Z0dkRxLeojJ5aETyRIcs4cPEC5ToV9xnEJCZg98h3tVDdndVhp5KchLlqSK9YOc21qI2F3rI1FQQA+jTLxccLG5ZGeD8TggPEgaxSvCylMQdJx1yfTilOSpqFuernneV+QxI5F9ExAkuzCWlTwEyOpyRpxOwFsTxS4yET2bqmB1WZDlX5rrvXMw14HYw+PXmuKjAmW0RvDUEzGEsJDwpcGHAFqEwSRnEAa4BxmWnInSsQ3utldSHDOIX1LPXE44X3SjmwFll8uJ+x2yp+nc0xMwJKkuSuOcvFNQe5ZkFFyd2DMV5L6kKQcDwDzNEx30-GBGcnGA1MZzMhLuA7FOfS4PF5QrwX1Pe0w0cPfX8bxxxK3J23s5hOEZSnIUrxFLkhybdUQA */
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





















import { ThemeIcon, Badge, Paper, Container, Button, Title, Timeline, Tabs, Blockquote, Alert } from '@mantine/core';
import { IconRocketOff, IconRocket, IconUser, IconCalendar, IconSend, IconBusinessplan, IconAlertCircle } from '@tabler/icons';
import { done, error } from 'xstate/lib/actions';
import { Card, UnstyledButton, Anchor } from '@mantine/core';
import {
    IconCreditCard,
    IconBuildingBank,
    IconRepeat,
    IconReceiptRefund,
    IconReceipt,
    IconReceiptTax,
    IconReport,
    IconCashBanknote,
    IconCoin,
} from '@tabler/icons';

const mockdata = [
    {
        title: 'Credit cards',
        icon: IconCreditCard,
        color: 'violet'
    },
    {
        title: 'Banks nearby',
        icon: IconBuildingBank,
        color: 'indigo'
    },
    {
        title: 'Transfers',
        icon: IconRepeat,
        color: 'blue'
    },
    {
        title: 'Refunds',
        icon: IconReceiptRefund,
        color: 'green'
    },
    {
        title: 'Receipts',
        icon: IconReceipt,
        color: 'teal'
    },
    {
        title: 'Taxes',
        icon: IconReceiptTax,
        color: 'cyan'
    },
    {
        title: 'Reports',
        icon: IconReport,
        color: 'pink'
    },
    {
        title: 'Payments',
        icon: IconCoin,
        color: 'red'
    },
    {
        title: 'Cashback',
        icon: IconCashBanknote,
        color: 'orange'
    },
];

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

    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: theme.radius.md,
        height: 90,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        transition: 'box-shadow 150ms ease, transform 100ms ease',

        '&:hover': {
            boxShadow: `${theme.shadows.md} !important`,
            transform: 'scale(1.05)',
        },
    },

    card3rd: {
        height: 440,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },

    title3rd: {
        fontFamily: `Greycliff CF ${theme.fontFamily}`,
        fontWeight: 900,
        color: theme.white,
        lineHeight: 1.2,
        fontSize: 32,
        marginTop: theme.spacing.xs,
    },

    category3rd: {
        color: theme.white,
        opacity: 0.7,
        fontWeight: 700,
        textTransform: 'uppercase',
    },


}));



import { useState } from 'react';


import { createStyles, Avatar, Text, Group } from '@mantine/core';
import { IconPhoneCall, IconAt } from '@tabler/icons';


import { DateRangePicker, DateRangePickerValue } from '@mantine/dates';

import { SimpleGrid } from '@mantine/core';


const MultiStepFormMachineComponentStatsCard = () => {
    const [state, send] = useMachine(multiStepFormMachine);

    const { classes, theme } = useStyles();

    const [timelineState, setActive] = useState(0);

    // const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    // const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    const items = mockdata.map((item) => (
        <UnstyledButton
            key={item.title}
            className={classes.item}
        >
            <item.icon
                color={theme.colors[item.color][6]}
                size={32}
            />
            <Text
                size="xs"
                mt={7}
            >
                {item.title}
            </Text>
        </UnstyledButton>
    ));


    const nextStep = () => setActive((current) => current + 1);
    const prevStep = () => setActive((current) => current - 1);


    const [blastOffDate, setBlastOffDate] = useState<DateRangePickerValue>([
        new Date(2022, 9, 4),
        new Date(2022, 9, 23),
    ]);


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
                        {
                            !state.matches("state080_success") &&
                            <IconRocketOff
                                size={34}
                                stroke={1.5}
                            />
                        }

                        {
                            state.matches("state080_success") &&
                            <IconRocket
                                size={48}
                                stroke={1.5}
                            />
                        }
                    </ThemeIcon>

                    <Title
                        order={1}
                        align='center'
                    >Application form recombobulator</Title>

                    <Title
                        order={2}
                        align='center'
                    >
                        <Badge
                            size='md'
                        >
                            Part 13.4 of subsection 29 of the Rocketeer Act
                        </Badge>
                    </Title>


































                    <Timeline
                        color="cyan"
                        radius="md"
                        active={timelineState}
                        lineWidth={4}
                        bulletSize={32}
                        mt="xl"
                    >


                        <Timeline.Item
                            bullet={<IconUser />}
                            title={"Entering rocketeer information"}
                        >
                            {
                                state.matches("state020_enteringRocketeer") &&
                                <div>



                                    <Group
                                        noWrap
                                        m="lg"
                                    >
                                        <Avatar
                                            src={'https://source.unsplash.com/random/?ugly,girl'}
                                            size={94}
                                            radius="md"
                                        />
                                        <div>
                                            <Text
                                                size="xs"
                                                weight={700}
                                                color="dimmed"
                                            >
                                                TOTALLY NOT A TERMINATOR
                                            </Text>

                                            <Text
                                                size="lg"
                                                weight={500}
                                            >
                                                Gordon Shumway
                                            </Text>

                                            <Group
                                                noWrap
                                                spacing={10}
                                                mt={3}
                                            >
                                                <IconAt
                                                    stroke={1.5}
                                                    size={16}
                                                    className={classes.icon}
                                                />
                                                <Text
                                                    size="xs"
                                                    color="dimmed"
                                                >
                                                    donkeypuncher@hotmail.com
                                                </Text>
                                            </Group>

                                            <Group
                                                noWrap
                                                spacing={10}
                                                mt={5}
                                            >
                                                <IconPhoneCall
                                                    stroke={1.5}
                                                    size={16}
                                                    className={classes.icon}
                                                />
                                                <Text
                                                    size="xs"
                                                    color="dimmed"
                                                >
                                                    +61 867 5309
                                                </Text>
                                            </Group>
                                        </div>
                                    </Group>



                                    <Button
                                        onClick={() => {
                                            send("EVENT021_CONFIRM_ROCKETEER");
                                            nextStep();
                                        }
                                        }
                                    >
                                        Confirm space cadet details
                                    </Button>
                                </div>
                            }

                        </Timeline.Item>







                        <Timeline.Item
                            bullet={<IconCalendar />}
                            title="Entering blast off date range"
                        >

                            {
                                state.matches("state030_enteringDate") &&
                                <div>



                                    <DateRangePicker
                                        m='lg'
                                        label="Launch window"
                                        placeholder="Pick dates range"
                                        value={blastOffDate}
                                        onChange={setBlastOffDate}
                                    />

                                    <Group
                                        position='apart'
                                        m="lg"
                                    >
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                send("EVENT031_BACK");
                                                prevStep();
                                            }
                                            }
                                        >
                                            Back
                                        </Button>

                                        <Button
                                            onClick={() => {
                                                send("EVENT032_CONFIRM_DATE");
                                                nextStep();
                                            }
                                            }
                                        >
                                            Confirm temporal anomaly
                                        </Button>
                                    </Group>
                                </div>
                            }

                        </Timeline.Item>






                        <Timeline.Item
                            title="Awaiting confirmation"
                            bullet={<IconReport />}
                            lineVariant="dashed"
                        >


                            {
                                state.matches("state040_confirming_with_3rd_party.state050_confirming_idle") &&
                                <div>

                                    <Tabs
                                        defaultValue="first"
                                        m="lg"
                                    >
                                        <Tabs.List
                                            grow
                                            position="apart"
                                        >
                                            <Tabs.Tab value="first">Company info</Tabs.Tab>
                                            <Tabs.Tab value="second">Motto</Tabs.Tab>
                                            <Tabs.Tab value="third">Services</Tabs.Tab>
                                        </Tabs.List>

                                        <Tabs.Panel
                                            value="first"
                                            pt="xs"
                                        >


                                            <Paper
                                                shadow="md"
                                                p="xl"
                                                radius="md"
                                                sx={{ backgroundImage: `url(https://source.unsplash.com/random/?technology,code)` }}
                                                className={classes.card3rd}
                                            >
                                                <div>
                                                    <Text
                                                        className={classes.category3rd}
                                                        size="xs"
                                                    >
                                                        TOTALLY NOT EVIL MEGA CORPORATION
                                                    </Text>
                                                    <Title
                                                        order={3}
                                                        className={classes.title3rd}
                                                    >
                                                        This is not the best organisation in the world
                                                    </Title>
                                                </div>
                                                <Button
                                                    variant="white"
                                                    color="dark"
                                                >
                                                    Read just the tribute
                                                </Button>
                                            </Paper>



                                        </Tabs.Panel>

                                        <Tabs.Panel
                                            value="second"
                                            pt="xs"
                                        >
                                            <Blockquote
                                                color="cyan"
                                                cite="– J.F. Queso"
                                            >
                                                We choose to go to the moon, not because it is cheesy...
                                            </Blockquote>
                                        </Tabs.Panel>

                                        <Tabs.Panel
                                            value="third"
                                            pt="xs"
                                        >
                                            <Card
                                                withBorder
                                                radius="md"
                                                className={classes.card}
                                            >
                                                <Group position="apart">
                                                    <Text className={classes.title}>Services</Text>
                                                    <Anchor
                                                        size="xs"
                                                        color="dimmed"
                                                        sx={{ lineHeight: 1 }}
                                                    >
                                                        + 21 other services
                                                    </Anchor>
                                                </Group>
                                                <SimpleGrid
                                                    cols={3}
                                                    mt="md"
                                                >
                                                    {items}
                                                </SimpleGrid>
                                            </Card>
                                        </Tabs.Panel>

                                    </Tabs>


                                    <Alert icon={<IconAlertCircle size={16} />} title="Next step" color="cyan" radius="md" variant="outline">
                                        Have they managed to get back to you by the date (insert from above) in order for us to get Spacely Sprockets off our planet?
                                    </Alert>

                                    <Group
                                        position='apart'
                                        m="lg"
                                    >

                                        <Button
                                            color="orange"
                                            onClick={() => {
                                                send("EVENT051_BACK");
                                                prevStep();
                                            }
                                            }
                                        >
                                            NO
                                        </Button>

                                        <Button
                                            color="green"
                                            onClick={() => {
                                                send("EVENT051_CONFIRM_ALL");
                                                nextStep();
                                            }
                                            }
                                        >
                                            YES
                                        </Button>

                                    </Group>

                                </div>
                            }

                        </Timeline.Item>







                        <Timeline.Item
                            title="Confirm and submit"
                            bullet={<IconSend />}
                            lineVariant="dashed"
                        >



                            {
                                state.matches("state040_confirming_with_3rd_party.state060_confirming_submitting") &&
                                <div>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio eius labore nisi tempore modi vel voluptate ullam nostrum adipisci suscipit eaque quae cupiditate, accusamus minus laboriosam totam laborum, deserunt sint.
                                    </p>

                                    <Group
                                        position='apart'
                                        m="lg"
                                    >
                                        <Button
                                            onClick={() => {
                                                error("EVENT051_BACK");
                                                prevStep();
                                            }
                                            }
                                        >
                                            NO
                                        </Button>

                                        <Button
                                            onClick={() => {
                                                done("EVENT061_SUBMIT");
                                                nextStep();
                                            }
                                            }
                                        >
                                            YES
                                        </Button>

                                    </Group>
                                </div>
                            }



                        </Timeline.Item>






                        <Timeline.Item
                            title="Application submitted"
                            bullet={<IconBusinessplan />}
                        >

                            {
                                state.matches("state080_success") &&
                                <div>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio eius labore nisi tempore modi vel voluptate ullam nostrum adipisci suscipit eaque quae cupiditate, accusamus minus laboriosam totam laborum, deserunt sint.
                                    </p>
                                </div>
                            }
                        </Timeline.Item>
                    </Timeline>









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
