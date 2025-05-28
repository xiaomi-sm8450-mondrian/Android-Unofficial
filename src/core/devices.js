const DEVICE_NAMES = {
    cupid: "Xiaomi 12",
    mayfly: "Xiaomi 12S",
    zeus: "Xiaomi 12 Pro",
    unicorn: "Xiaomi 12S Pro",
    diting: "Xiaomi 12T Pro",
};

export function getDeviceName(device) {
    return device in DEVICE_NAMES ? DEVICE_NAMES[device] : device;
}
