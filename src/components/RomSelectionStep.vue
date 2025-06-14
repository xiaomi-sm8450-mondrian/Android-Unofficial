<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex flex-column flex-grow-1 pa-6">
            <!-- Header -->
            <div class="text-center mb-6">
                <h2 class="text-h4 font-weight-light mb-2">Choose your ROM</h2>
                <p class="text-subtitle-1 grey--text">
                    Select which Android ROM you want to install on your device
                </p>
            </div>

            <!-- ROM Selection Cards -->
            <v-row justify="center" class="flex-grow-1">
                <v-col
                    v-for="rom in availableRoms"
                    :key="rom.id"
                    cols="12"
                    md="4"
                    class="d-flex"
                >
                    <v-card
                        :class="[
                            'rom-card flex-grow-1 d-flex flex-column',
                            { 'rom-card--selected': selectedRom === rom.id }
                        ]"
                        :color="selectedRom === rom.id ? 'primary' : ''"
                        :dark="selectedRom === rom.id"
                        outlined
                        hover
                        @click="selectRom(rom.id)"
                        style="cursor: pointer; transition: all 0.3s ease;"
                    >
                        <v-card-title class="justify-center text-center">
                            <div>
                                <v-avatar size="64" class="mb-3" :color="rom.color">
                                    <v-icon size="40" color="white">{{ rom.icon }}</v-icon>
                                </v-avatar>
                                <div class="text-h6">{{ rom.name }}</div>
                            </div>
                        </v-card-title>

                        <v-card-text class="flex-grow-1 text-center">
                            <p class="mb-2">{{ rom.description }}</p>
                            <v-chip
                                v-for="feature in rom.features"
                                :key="feature"
                                small
                                class="ma-1"
                                :color="selectedRom === rom.id ? 'white' : 'primary'"
                                :text-color="selectedRom === rom.id ? 'primary' : 'white'"
                            >
                                {{ feature }}
                            </v-chip>
<<<<<<< HEAD
                        </v-card-text>                        <v-card-actions class="justify-center pa-4">
=======
                        </v-card-text>

                        <v-card-actions class="justify-center pa-4">
>>>>>>> 351ea0708cb75afcb0934ed70c43675a121c996a
                            <v-btn
                                :color="selectedRom === rom.id ? 'white' : 'primary'"
                                :text="selectedRom !== rom.id"
                                :outlined="selectedRom !== rom.id"
<<<<<<< HEAD
                                :dark="selectedRom !== rom.id"
                                :class="{ 'primary--text': selectedRom === rom.id }"
=======
>>>>>>> 351ea0708cb75afcb0934ed70c43675a121c996a
                                @click.stop="selectRom(rom.id)"
                            >
                                {{ selectedRom === rom.id ? 'Selected' : 'Select' }}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Additional Info -->
            <v-expand-transition>
                <v-card
                    v-if="selectedRom"
                    class="mt-4"
                    outlined
                >
                    <v-card-text>
                        <div class="d-flex align-center mb-2">
                            <v-icon color="info" class="mr-2">mdi-information</v-icon>
                            <span class="font-weight-medium">About {{ getSelectedRomName() }}</span>
                        </div>
                        <p class="mb-2">{{ getSelectedRomDetails() }}</p>
                        <div class="d-flex flex-wrap">
                            <v-chip
                                small
                                color="info"
                                class="mr-2 mb-1"
                                v-for="detail in getSelectedRomSpecs()"
                                :key="detail"
                            >
                                {{ detail }}
                            </v-chip>
                        </div>
                    </v-card-text>
                </v-card>
            </v-expand-transition>
        </div>

        <!-- Navigation Buttons -->
        <v-card-actions class="pa-6 pt-0">
            <v-btn
                text
                color="primary"
                @click="$emit('prevStep')"
            >
                <v-icon left>mdi-arrow-left</v-icon>
                Back
            </v-btn>
            
            <v-spacer></v-spacer>
            
            <v-btn
                color="primary"
                :disabled="!selectedRom"
                @click="continueToNext"
            >
                Continue
                <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
        </v-card-actions>
    </div>
</template>

<script>
import config from "../config";

export default {
    name: "RomSelectionStep",
    props: {
        active: {
            type: Boolean,
            default: false,
        },
        device: {
            type: Object,
            default: null,
        },
        blobStore: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            selectedRom: null,
            availableRoms: [
                {
                    id: config.AVAILABLE_ROMS.RISING.id,
                    name: config.AVAILABLE_ROMS.RISING.name,
                    description: config.AVAILABLE_ROMS.RISING.description,
                    color: config.AVAILABLE_ROMS.RISING.color,
                    icon: "mdi-rocket-launch",
                    features: config.AVAILABLE_ROMS.RISING.features,
                    details: "RisingOS is a custom Android ROM that focuses on providing a smooth and customizable experience with various theming options and performance enhancements.",
                    specs: ["Android 15", "Frequent Updates", "Pixel Features", "Full Customization"],
                    downloadBaseUrl: config.AVAILABLE_ROMS.RISING.downloadBaseUrl
                },
                {
                    id: config.AVAILABLE_ROMS.AXION.id,
                    name: config.AVAILABLE_ROMS.AXION.name,
                    description: config.AVAILABLE_ROMS.AXION.description,
                    color: config.AVAILABLE_ROMS.AXION.color,
                    icon: "mdi-android",
                    features: config.AVAILABLE_ROMS.AXION.features,
                    details: "Axion AOSP provides a near-stock Android experience with minimal modifications, focusing on stability and the pure Google vision of Android.",
                    specs: ["Android 15", "Clean UI", "Performance Focus", "Regular Updates"],
                    downloadBaseUrl: config.AVAILABLE_ROMS.AXION.downloadBaseUrl
                },
                {
                    id: config.AVAILABLE_ROMS.HYPEROS.id,
                    name: config.AVAILABLE_ROMS.HYPEROS.name,
                    description: config.AVAILABLE_ROMS.HYPEROS.description,
                    color: config.AVAILABLE_ROMS.HYPEROS.color,
                    icon: "mdi-lightning-bolt",
                    features: config.AVAILABLE_ROMS.HYPEROS.features,
                    details: "HyperOS 2 is Xiaomi's evolution of MIUI, featuring AI-powered optimizations, enhanced performance, and a refined user interface.",
                    specs: ["Stock ROM", "Enhanced Performance", "Xiaomi Features", "HyperOS UI"],
                    downloadBaseUrl: config.AVAILABLE_ROMS.HYPEROS.downloadBaseUrl
                }
            ]
        };
    },
    methods: {
        selectRom(romId) {
            this.selectedRom = romId;
            // Store the selected ROM in the global state or emit to parent
            this.$emit('romSelected', romId);
        },
        continueToNext() {
            if (this.selectedRom) {
                // Store the selected ROM configuration
                this.storeRomSelection();
                this.$emit('nextStep');
            }
        },
        storeRomSelection() {
            // Store the selected ROM in localStorage or vuex store
            const selectedRomData = this.availableRoms.find(rom => rom.id === this.selectedRom);
            if (selectedRomData) {
                localStorage.setItem('selectedRom', JSON.stringify(selectedRomData));
                // Also emit to parent component
                this.$emit('romConfigured', selectedRomData);
            }
        },
        getSelectedRomName() {
            const rom = this.availableRoms.find(rom => rom.id === this.selectedRom);
            return rom ? rom.name : '';
        },
        getSelectedRomDetails() {
            const rom = this.availableRoms.find(rom => rom.id === this.selectedRom);
            return rom ? rom.details : '';
        },
        getSelectedRomSpecs() {
            const rom = this.availableRoms.find(rom => rom.id === this.selectedRom);
            return rom ? rom.specs : [];
        }
    },
    mounted() {
        // Check if there's a previously selected ROM
        const savedRom = localStorage.getItem('selectedRom');
        if (savedRom) {
            try {
                const romData = JSON.parse(savedRom);
                this.selectedRom = romData.id;
            } catch (e) {
                console.warn('Failed to parse saved ROM selection');
            }
        }
    }
};
</script>

<style scoped>
.rom-card {
    transition: all 0.3s ease;
    border-width: 2px !important;
}

.rom-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.rom-card--selected {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(0,0,0,0.2) !important;
}

.v-card__title {
    word-break: normal;
}

.v-chip {
    font-size: 0.75rem;
}
</style>
