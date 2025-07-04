<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex flex-column flex-grow-1 pa-6">
            <!-- Header -->
            <div class="text-center mb-6">
                <h2 class="text-h4 font-weight-light mb-2">Choose Variant</h2>
                <p class="text-subtitle-1 grey--text">
                    Select which variant of {{ getSelectedRomName() }} you want to install
                </p>
            </div>

            <!-- Variant Selection Cards -->
            <v-row justify="center" class="flex-grow-1">
                <v-col
                    v-for="variant in availableVariants"
                    :key="variant.id"
                    cols="12"
                    md="6"
                    lg="4"
                    class="d-flex"
                >
                    <v-card
                        :class="[
                            'variant-card flex-grow-1 d-flex flex-column',
                            { 'variant-card--selected': selectedVariant === variant.id }
                        ]"
                        :color="selectedVariant === variant.id ? 'primary' : ''"
                        :dark="selectedVariant === variant.id"
                        outlined
                        hover
                        @click="selectVariant(variant.id)"
                        style="cursor: pointer; transition: all 0.3s ease;"
                    >
                        <v-card-title class="justify-center text-center">
                            <div>
                                <v-avatar size="64" class="mb-3" :color="variant.color">
                                    <v-icon size="40" :color="selectedVariant === variant.id ? 'primary' : 'white'">{{ variant.icon }}</v-icon>
                                </v-avatar>
                                <div class="text-h6">{{ variant.name }}</div>
                            </div>
                        </v-card-title>

                        <v-card-text class="flex-grow-1 text-center">
                            <p class="mb-2">{{ variant.description }}</p>
                            <v-chip
                                v-for="feature in variant.features"
                                :key="feature"
                                small
                                class="ma-1"
                                :color="selectedVariant === variant.id ? 'white' : 'primary'"
                                :text-color="selectedVariant === variant.id ? 'primary' : 'white'"
                            >
                                {{ feature }}
                            </v-chip>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>            <!-- Variant Details -->
            <v-expand-transition>
                <v-card
                    v-if="selectedVariant"
                    class="mt-4 pa-4"
                    outlined
                    :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'"
                >
                    <v-card-text>
                        <div class="d-flex align-center mb-2">
                            <v-icon :color="$vuetify.theme.dark ? 'blue lighten-2' : 'primary'" class="mr-2">mdi-information</v-icon>
                            <span class="font-weight-medium">About {{ getSelectedVariantName() }}</span>
                        </div>
                        <p class="mb-2">{{ getSelectedVariantDetails() }}</p>
                        <div class="d-flex flex-wrap">
                            <v-chip
                                small
                                :color="$vuetify.theme.dark ? 'blue darken-1' : 'primary'"
                                :text-color="$vuetify.theme.dark ? 'white' : 'white'"
                                class="mr-2 mb-1"
                                v-for="detail in getSelectedVariantSpecs()"
                                :key="detail"
                            >
                                {{ detail }}
                            </v-chip>
                        </div>
                    </v-card-text>
                </v-card>
            </v-expand-transition>

            <!-- Installation Method Selection -->
            <v-expand-transition>
                <v-card
                    v-if="selectedVariant"
                    class="mt-4 pa-4"
                    outlined
                    :color="$vuetify.theme.dark ? 'grey darken-2' : 'grey lighten-5'"
                >
                    <v-card-text>
                        <div class="d-flex align-center mb-3">
                            <v-icon :color="$vuetify.theme.dark ? 'green lighten-2' : 'success'" class="mr-2">mdi-download-box</v-icon>
                            <span class="font-weight-medium">Installation Method</span>
                        </div>
                        <p class="mb-3 text-body-2">Choose how you want to install this ROM:</p>
                        
                        <v-radio-group v-model="installationMethod" class="mt-0">
                            <v-radio
                                label="Download from server"
                                value="download"
                                color="primary"
                            >
                                <template v-slot:label>
                                    <div class="d-flex align-center">
                                        <v-icon small class="mr-2">mdi-cloud-download</v-icon>
                                        <span>Download from server</span>
                                    </div>
                                </template>
                            </v-radio>
                            <v-radio
                                label="Browse local file"
                                value="local"
                                color="primary"
                            >
                                <template v-slot:label>
                                    <div class="d-flex align-center">
                                        <v-icon small class="mr-2">mdi-folder-open</v-icon>
                                        <span>Browse local file</span>
                                    </div>
                                </template>
                            </v-radio>
                        </v-radio-group>

                        <!-- Local File Selection -->
                        <v-expand-transition>
                            <div v-if="installationMethod === 'local'" class="mt-3">
                                <v-file-input
                                    v-model="selectedFile"
                                    label="Select ROM ZIP file"
                                    accept=".zip"
                                    prepend-icon="mdi-file-zip-box"
                                    show-size
                                    color="primary"
                                    outlined
                                    dense
                                    @change="onFileSelected"
                                >
                                    <template v-slot:selection="{ text }">
                                        <v-chip
                                            color="primary"
                                            dark
                                            label
                                            small
                                        >
                                            {{ text }}
                                        </v-chip>
                                    </template>
                                </v-file-input>
                                
                                <v-alert
                                    v-if="selectedFile"
                                    type="info"
                                    outlined
                                    dense
                                    class="mt-2"
                                >
                                    <div class="d-flex align-center">
                                        <v-icon small class="mr-2">mdi-information</v-icon>
                                        <span class="text-body-2">
                                            Selected: {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
                                        </span>
                                    </div>
                                </v-alert>
                            </div>
                        </v-expand-transition>
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
                :disabled="!canContinue"
                @click="continueToNext"
            >
                {{ installationMethod === 'local' ? 'Install from Local File' : 'Continue to Download' }}
                <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
        </v-card-actions>
    </div>
</template>

<script>
export default {
    name: "VariantSelectionStep",
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
        selectedRom: {
            type: String,
            default: null,
        },
    },    data() {
        return {
            selectedVariant: null,
            installationMethod: 'download', // 'download' or 'local'
            selectedFile: null,
        };
    },
    computed: {
        availableVariants() {
            // Return variants based on selected ROM
            switch (this.selectedRom) {
                case 'rising':
                    return [
                        {
                            id: 'GAPPS',
                            name: 'GAPPS',
                            description: 'Includes Google Apps and Google Play Services',
                            color: '#4CAF50',
                            icon: 'mdi-google-play',
                            features: ['Google Apps', 'Play Store', 'Google Services'],
                            details: 'This variant includes all Google applications and services, providing the full Android experience with Google integration.',
                            specs: ['Google Play Store', 'Gmail', 'Google Services', 'Complete Experience']
                        },
                        {
                            id: 'VANILLA',
                            name: 'VANILLA',
                            description: 'Pure Android experience without Google services',
                            color: '#FF9800',
                            icon: 'mdi-android',
                            features: ['No Google', 'Pure AOSP', 'Privacy Focused'],
                            details: 'This variant provides a clean Android experience without any Google applications or services, perfect for privacy-conscious users.',
                            specs: ['No Google Apps', 'Pure Android', 'Privacy Focused', 'Lightweight']
                        }
                    ];
                case 'axion':
                    return [
                        {
                            id: 'GAPPS',
                            name: 'GAPPS',
                            description: 'Includes Google Apps and Google Play Services',
                            color: '#4CAF50',
                            icon: 'mdi-google-play',
                            features: ['Google Apps', 'Play Store', 'Google Services'],
                            details: 'This variant includes all Google applications and services, providing the full Android experience with Google integration.',
                            specs: ['Google Play Store', 'Gmail', 'Google Services', 'Complete Experience']
                        },
                        {
                            id: 'VANILLA',
                            name: 'VANILLA',
                            description: 'Pure AOSP experience without Google services',
                            color: '#2196F3',
                            icon: 'mdi-android',
                            features: ['Pure AOSP', 'No Google', 'Clean'],
                            details: 'This variant provides a pure AOSP experience without any Google applications or services, staying true to the original Android vision.',
                            specs: ['Pure AOSP', 'No Google Apps', 'Clean Experience', 'Minimalist']
                        }
                    ];
                case 'hyperos':
                    return [
                        {
                            id: 'GAPPS',
                            name: 'GLOBAL',
                            description: 'Global version with Google services',
                            color: '#4CAF50',
                            icon: 'mdi-earth',
                            features: ['Global ROM', 'Google Services', 'Multi-language'],
                            details: 'This is the global version of HyperOS with Google services and support for multiple languages and regions.',
                            specs: ['Google Services', 'Multi-language', 'Global Features', 'Full Access']
                        },
                        {
                            id: 'CN',
                            name: 'CHINA',
                            description: 'China version optimized for Chinese users',
                            color: '#F44336',
                            icon: 'mdi-map-marker',
                            features: ['China ROM', 'Optimized', 'Regional Features'],
                            details: 'This is the China version of HyperOS optimized for Chinese users with regional features and optimizations.',
                            specs: ['China Optimized', 'Regional Features', 'Local Services', 'Specialized']
                        }
                    ];                default:
                    return [];
            }
        },
        canContinue() {
            if (!this.selectedVariant) {
                return false;
            }
            if (this.installationMethod === 'local') {
                return this.selectedFile !== null;
            }
            return true;
        }
    },
    methods: {
        selectVariant(variantId) {
            this.selectedVariant = variantId;
            // Store the selected variant in the global state or emit to parent
            this.$emit('variantSelected', variantId);
        },        continueToNext() {
            if (this.selectedVariant) {
                // Store the selected variant configuration
                this.storeVariantSelection();
                
                if (this.installationMethod === 'local' && this.selectedFile) {
                    // Skip download step and go directly to install with local file
                    this.handleLocalFile();
                } else {
                    // Continue to download step
                    this.$emit('nextStep');
                }
            }
        },        storeVariantSelection() {
            // Store the selected variant in localStorage or vuex store
            const selectedVariantData = this.availableVariants.find(variant => variant.id === this.selectedVariant);
            if (selectedVariantData) {
                localStorage.setItem('selectedVariant', JSON.stringify(selectedVariantData));
                // Store installation method and selected file info
                localStorage.setItem('installationMethod', this.installationMethod);
                if (this.installationMethod === 'local' && this.selectedFile) {
                    localStorage.setItem('selectedLocalFile', JSON.stringify({
                        name: this.selectedFile.name,
                        size: this.selectedFile.size,
                        type: this.selectedFile.type
                    }));
                }
                // Also emit to parent component
                this.$emit('variantConfigured', {
                    rom: this.selectedRom,
                    variant: this.selectedVariant,
                    variantData: selectedVariantData,
                    installationMethod: this.installationMethod,
                    localFile: this.selectedFile
                });
            }
        },        handleLocalFile() {
            // Store the file in the blob store for later use
            if (this.blobStore && this.selectedFile) {
                try {
                    this.blobStore.store('localRomFile', this.selectedFile);
                    // Skip download step and go directly to connect step or install step
                    this.$emit('skipToInstall');
                } catch (error) {
                    console.error('Failed to store local file in blob store:', error);
                    // Fallback: just emit the event anyway, the install step will handle the error
                    this.$emit('skipToInstall');
                }
            } else {
                console.warn('BlobStore not available or no file selected');
            }
        },
        onFileSelected(file) {
            this.selectedFile = file;
        },
        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        getSelectedRomName() {
            switch (this.selectedRom) {
                case 'rising':
                    return 'RisingOS';
                case 'axion':
                    return 'Axion AOSP';
                case 'hyperos':
                    return 'HyperOS 2';
                default:
                    return 'ROM';
            }
        },
        getSelectedVariantName() {
            const variant = this.availableVariants.find(variant => variant.id === this.selectedVariant);
            return variant ? variant.name : '';
        },
        getSelectedVariantDetails() {
            const variant = this.availableVariants.find(variant => variant.id === this.selectedVariant);
            return variant ? variant.details : '';
        },
        getSelectedVariantSpecs() {
            const variant = this.availableVariants.find(variant => variant.id === this.selectedVariant);
            return variant ? variant.specs : [];
        }
    },
    mounted() {
        // Check if there's a previously selected variant
        const savedVariant = localStorage.getItem('selectedVariant');
        if (savedVariant) {
            try {
                const variantData = JSON.parse(savedVariant);
                this.selectedVariant = variantData.id;
            } catch (e) {
                console.warn('Failed to parse saved variant selection');
            }
        }
    }
};
</script>

<style scoped>
.variant-card {
    transition: all 0.3s ease;
    border-width: 2px !important;
    min-height: 280px;
}

.variant-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.variant-card--selected {
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
