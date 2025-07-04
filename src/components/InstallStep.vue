<template>
    <v-container class="d-flex justify-space-between flex-column flex-grow-1">
        <div class="mt-n4 flex-grow-1" v-if="$root.$data.release !== null || isLocalFile">
            <h6 class="text-h6 pb-4">Install {{ $root.$data.OS_NAME }}</h6>

            <div class="text-body-1">
                <!-- Local file installation -->
                <div v-if="isLocalFile">
                    <p>
                        This will install your local ROM file
                        <strong>{{ localFileInfo.name }}</strong>
                        ({{ formatFileSize(localFileInfo.size) }})
                        on your {{ getDeviceName($root.$data.product) }}.
                    </p>
                    <v-alert
                        type="info"
                        outlined
                        dense
                        class="my-3"
                    >
                        <v-icon small class="mr-2">mdi-information</v-icon>
                        Installing from local file. Make sure this is a compatible ROM for your device.
                    </v-alert>
                </div>
                <!-- Downloaded file installation -->
                <div v-else>
                    <p>
                        This will install
                        {{ $root.$data.release.version
                        }}{{
                            $root.$data.RELEASE_VARIANTS[
                                $root.$data.release.variant
                            ].suffix
                        }}
                        on your
                        {{ getDeviceName($root.$data.product) }}.
                    </p>
                </div>
                <p v-if="$root.$data.installType === 'clean'">
                    Because you’re doing a clean install to switch from another
                    OS,
                    <strong class="red--text text--darken-3"
                        >all data on your device will be permanently
                        lost.</strong
                    >
                </p>
                <p>
                    <strong>Don’t touch, unplug, or press any buttons</strong>
                    on your device during the install.
                </p>
                <p>
                    Your phone will restart several times, but
                    <strong>don’t touch it.</strong> Watch the progress bar
                    on this page instead.
                </p>
            </div>

            <v-btn
                :color="installed ? null : 'primary'"
                :disabled="installProgress !== null"
                @click="install"
                >Install</v-btn
            >
        </div>

        <div class="pb-8">
            <v-banner single-line outlined rounded v-if="installed">
                <v-icon slot="icon" color="green darken-3">mdi-check</v-icon>
                <div class="my-4">
                    <span class="text-body-1 green--text text--darken-3"
                        >Installed {{ $root.$data.OS_NAME }}
                        {{ $root.$data.release.version }}</span
                    >
                </div>
            </v-banner>
            <v-banner
                single-line
                outlined
                rounded
                class="mt-8 pt-1"
                v-else-if="installProgress !== null"
            >
                <v-icon slot="icon" color="primary">{{
                    installStatusIcon
                }}</v-icon>
                <span class="text-body-1">{{ installStatus }}</span>
                <v-progress-linear
                    class="my-3"
                    buffer-value="0"
                    :value="installProgress"
                    stream
                ></v-progress-linear>
            </v-banner>
            <v-banner
                single-line
                outlined
                rounded
                class="mt-8"
                v-else-if="error"
            >
                <v-icon slot="icon" color="red darken-3">mdi-close</v-icon>
                <div class="my-4">
                    <span class="text-body-1 red--text text--darken-3">{{
                        error
                    }}</span>
                </div>
            </v-banner>
        </div>

        <div class="d-flex justify-space-between flex-row-reverse">
            <v-btn
                color="primary"
                @click="$bubble('nextStep')"
                :disabled="installing || !installed"
                >Next <v-icon dark right>mdi-arrow-right</v-icon></v-btn
            >
            <v-btn text @click="$bubble('prevStep')" :disabled="installing"
                >Back</v-btn
            >
        </div>
    </v-container>
</template>

<style>
.v-progress-linear__determinate {
    transition: none !important;
}

.v-banner--single-line .v-banner__text {
    white-space: normal !important;
}
</style>

<script>
import * as fastboot from "android-fastboot";

import { getDeviceName } from "../core/devices";

fastboot.configureZip({
    workerScripts: {
        inflate: ["js/vendor/z-worker-pako.js", "pako_inflate.min.js"],
    },
});

const INSTALL_STATUS_ICONS = {
    load: "mdi-archive-arrow-down-outline",
    unpack: "mdi-archive-arrow-down-outline",
    flash: "mdi-cellphone-arrow-down",
    wipe: "mdi-cellphone-erase",
    reboot: "mdi-restart",
};

export default {
    name: "InstallStep",

    props: ["device", "blobStore", "active"],

    data: () => ({
        installProgress: null,
        installStatus: "",
        installStatusIcon: null,
        installed: false,
        installing: false,
        firstInstall: true,
        error: null,

        memoryDialog: false,
    }),

    computed: {
        isLocalFile() {
            return this.blobStore && this.blobStore.get && this.blobStore.get('localRomFile') !== null;
        },
        localFileInfo() {
            if (!this.isLocalFile) return null;
            try {
                const savedFileInfo = localStorage.getItem('selectedLocalFile');
                return savedFileInfo ? JSON.parse(savedFileInfo) : null;
            } catch (e) {
                return null;
            }
        }
    },

    watch: {
        active: async function (newState) {
            if (newState) {
                this.saEvent("step_install");
            }
        },
    },

    methods: {
        getDeviceName,

        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        reconnectCallback() {
            this.$bubble("requestDeviceReconnect");
        },

        async retryMemory() {
            this.memoryDialog = false;
            await this.install();
        },

        async errorRetry() {
            await this.install();
        },

        async install() {
            this.installed = false;
            this.installing = true;

            try {
                if (!this.device.isConnected) {
                    await this.device.connect();
                }

                this.saEvent(
                    `install_build__${this.$root.$data.product}_${this.$root.$data.release.version}_${this.$root.$data.release.variant}`
                );
                
                // Check for local file first, then fall back to downloaded file
                let blob = null;
                if (this.blobStore && this.blobStore.get) {
                    blob = this.blobStore.get('localRomFile');
                }
                if (!blob) {
                    blob = this.$root.$data.zipBlob;
                }
                
                if (!blob) {
                    throw new Error('No ROM file available for installation');
                }
                
                await this.device.flashFactoryZip(
                    blob,
                    this.$root.$data.installType === "clean",
                    this.reconnectCallback,
                    (action, item, progress) => {
                        let userAction = fastboot.USER_ACTION_MAP[action];
                        let userItem =
                            item === "avb_custom_key"
                                ? "verified boot key"
                                : item;
                        this.installStatus = `${userAction} ${userItem}`;
                        this.installStatusIcon = INSTALL_STATUS_ICONS[action];
                        this.installProgress = progress * 100;
                    }
                );

                this.installStatus = `Restarting into ${this.$root.$data.OS_NAME}`;
                await this.device.reboot("");

                this.installed = true;
                this.error = null;

                if (this.firstInstall) {
                    this.firstInstall = false;
                    this.$bubble("nextStep");
                }
            } catch (e) {
                this.installed = false;
                this.installProgress = null;

                let [handled, message] = this.bubbleError(e);
                this.error = message;
                if (!handled) {
                    throw e;
                }
            } finally {
                this.installing = false;
            }
        },
    },
};
</script>
