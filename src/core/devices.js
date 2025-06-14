const DEVICE_NAMES = {
    mondrian: "Poco F5 Pro / Redmi K60",
};

export function getDeviceName(device) {
    return device in DEVICE_NAMES ? DEVICE_NAMES[device] : device;
}
