export default {
    OS_NAME: process.env.VUE_APP_OS_NAME,
    ACCENT_COLOR: "#0366d6",
    SUPPORTED_DEVICES: [
        {
            name: "Xiaomi 12",
            model: "cupid",
        },
        {
            name: "Xiaomi 12S",
            model: "mayfly",
        },
        {
            name: "Xiaomi 12 Pro",
            model: "zeus",
        },
        {
            name: "Xiaomi 12S Pro",
            model: "unicorn",
        },
        {
            name: "Xiaomi 12T Pro",
            model: "diting",
        },
    ],
    RELEASE_VARIANTS: {
        core: {
            description: "Minimal version Core Google apps and services.",
            suffix: "",
        },
    },
    DONATION_LINKS: [
        {
            title: "Recurring donation",
            description:
                "Please consider making a recurring donation on Patreon for benefits such as early access to updates, exclusive behind-the-scenes development news, and priority support. This allows us to support the project sustainably in the future.",
            highlight: true,
            url: "https://patreon.com/kdrag0n",
            icon: "patreon",
        },
        {
            title: "One-time donation",
            description:
                "You can also make a one-time donation through PayPal. It doesn’t help with sustainable support, but every little bit is appreciated!",
            highlight: false,
            url: "https://paypal.me/kdrag0ndonate",
            icon: "paypal",
        },
    ],
};
