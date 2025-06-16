export default {
    OS_NAME: process.env.VUE_APP_OS_NAME,
    ACCENT_COLOR: "#0366d6",
    SUPPORTED_DEVICES: [
        {
            name: "Poco F5 Pro / Redmi K60",
            model: "mondrian",
        },
    ],
    AVAILABLE_ROMS: {
        RISING: {
            id: "rising",
            name: "RisingOS",
            description: "A feature-rich custom ROM with extensive customization options",
            downloadBaseUrl: "https://github.com/RisingTechOSS/android_releases/releases/latest/download/",
            features: ["Customizable", "Stable", "Performance"],
            color: "#FF6B35"
        },
        AXION: {
            id: "axion", 
            name: "Axion AOSP",
            description: "Pure AOSP experience with minimal modifications",
            downloadBaseUrl: "https://github.com/axion-os/releases/releases/latest/download/",
            features: ["Pure AOSP", "Minimal", "Clean"],
            color: "#2196F3"
        },
        HYPEROS: {
            id: "hyperos",
            name: "Xiaomi HyperOS 2", 
            description: "Xiaomi's latest operating system with AI-powered features",
            downloadBaseUrl: "https://github.com/hyperos-releases/releases/latest/download/",
            features: ["HyperOS Features", "HyperOS Style", "Optimized"],
            color: "#FF9800"
        }
    },
    RELEASE_VARIANTS: {
        GAPPS: {
            description: "Normal Google apps and services.",
            suffix: "",
        },
    },
    DONATION_LINKS: [
        {
            title: "Buy Me a Coffee",
            description:
                "Support the development by buying me a coffee. Every contribution helps keep this project going!",
            highlight: true,
            url: "https://buymeacoffee.com/keosh",
            icon: "buymeacoffee",
        },
    ],
};
