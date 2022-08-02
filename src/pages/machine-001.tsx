import { createMachine } from "xstate";
import { useMachine } from "@xstate/react";
import { createStyles, Title, Button, Container } from '@mantine/core';
import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';
import { Center } from '@mantine/core';

const promiseMachine =
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AtgS1mAdMmAHYTbFQDEASgKIDKA8gDIBqtiK6s2ALtumKcQAD0QBGAKwAWfAGYAHADY5AdnEqZABi3jVAGhABPRAE5J+U6unS50rQvXircgL6vDaLLgJFS5KjoAKVoAYQAVYWRuPgEhJFEJGXllNQ05bV0DYwklWVM1aVMlU1KZDQAmdw8QYnQIOCiMHDxCEjIKKJj+QWExBGkKwxMEUwV8aSUtEsGK8QVJSSqarxaCVDh0ABsAN0gunh740H6K1SV5OQq1SVMz1Tni4cQFU0slRzlTSclxGy1JO5PM0fPgNgArMAAY14+wS0UOcT6iDOFzkVxud1UD2cSmeCCk4wK8w031Upi0FWmQJAqx8B1ivQS-Xm+Pm1VcQA */
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










const useStyles = createStyles((theme) => ({
    wrapper: {
        position: 'relative',
        paddingTop: 120,
        paddingBottom: 80,

        '@media (max-width: 755px)': {
            paddingTop: 80,
            paddingBottom: 60,
        },
    },

    inner: {
        position: 'relative',
        zIndex: 1,
    },

    dots: {
        position: 'absolute',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],

        '@media (max-width: 755px)': {
            display: 'none',
        },
    },

    dotsLeft: {
        left: 0,
        top: 0,
    },

    title: {
        textAlign: 'center',
        fontWeight: 800,
        fontSize: 40,
        letterSpacing: -1,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        marginBottom: theme.spacing.xs,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,

        '@media (max-width: 520px)': {
            fontSize: 28,
            textAlign: 'left',
        },
    },

    highlight: {
        color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6],
    },

    description: {
        textAlign: 'center',

        '@media (max-width: 520px)': {
            textAlign: 'left',
            fontSize: theme.fontSizes.md,
        },
    },

    controls: {
        marginTop: theme.spacing.lg,
        display: 'flex',
        justifyContent: 'center',

        '@media (max-width: 520px)': {
            flexDirection: 'column',
        },
    },

    control: {
        '&:not(:first-of-type)': {
            marginLeft: theme.spacing.md,
        },

        '@media (max-width: 520px)': {
            height: 42,
            fontSize: theme.fontSizes.md,

            '&:not(:first-of-type)': {
                marginTop: theme.spacing.md,
                marginLeft: 0,
            },
        },
    },
}));

export function HeroText() {
    const [state, send] = useMachine(promiseMachine);
    const { classes } = useStyles();

    console.log(state.value);

    return (
        <Container
            className={classes.wrapper}
            size={800}
            mt={-80}
        >

            <Title className={classes.title}>
                State of the <span className={classes.highlight}>the machine</span> in realtime
            </Title>

            <Container
                p={0}
                mt={20}
                size={600}
            >

                {
                    state.matches("pending") &&
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Pending"
                        color="cyan"
                        variant="outline"
                    >
                        Build more reliable software with AI companion. AI is also trained to detect lazy developers who do nothing and just complain on Twitter.
                    </Alert>
                }

                {
                    state.matches("resolved") &&
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Resolved"
                        color="green"
                        radius="md"
                        variant="filled"
                    >
                        Bacon ipsum dolor amet turkey doner corned beef burgdoggen andouille beef. Kielbasa ball tip boudin ground round.
                    </Alert>
                }

                {
                    state.matches("rejected") &&
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Rejected"
                        color="red"
                        radius="xs"
                        variant="filled"
                    >
                        The soothing and smoothing, anti-inflammatory and antioxidant-rich blend works with the gentle, natural AHA enzyme action of Australian Caviar Lime and the BHA deep-cleansing benefits of naturally-derived salicylic acid and astringent Australian Lemon Myrtle.
                    </Alert>
                }

                {
                    state.matches("pending") &&
                    <Center style={{ height: 100 }}>

                        <Button
                            onClick={() => send("REJECT")}
                            variant="outline"
                            color="red"
                            size="lg"
                        >
                            Reject
                        </Button>

                        <Button
                            onClick={() => send("RESOLVE")}
                            color="green"
                            size="lg"
                            ml={20}
                        >
                            Resolve
                        </Button>
                    </Center>
                }


                <iframe
                    src="https://stately.ai/viz/embed/0d2c96c6-afd5-4b72-a007-a396179c1551?mode=viz&panel=code&showOriginalLink=1&readOnly=1&pan=0&zoom=1.5&controls=0"
                    sandbox="allow-same-origin allow-scripts"
                    width={'100%'}
                    height={300}
                    frameBorder={0}
                    style={{ marginTop: 20 }}
                ></iframe>

            </Container>
        </Container>
    );
}




export default HeroText;
