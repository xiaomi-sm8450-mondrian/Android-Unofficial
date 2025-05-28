<template>
    <v-container class="d-flex flex-column justify-space-between flex-grow-1">
        <div>
            <h6 class="text-h6 pb-4">Unlock your bootloader</h6>

            <div class="text-body-1">
                <p v-if="unlocked">
                    Your device is unlocked. You may proceed.
                </p>
                <p v-else class="red--text text--darken-3">
                    Your device is not unlocked. Please enable OEM unlocking in Developer Options before continuing.
                </p>
            </div>
        </div>

        <div class="d-flex justify-space-between flex-row-reverse">
            <v-btn
                color="primary"
                :disabled="!unlocked"
                @click="$bubble('nextStep')"
            >
                Next <v-icon dark right>mdi-arrow-right</v-icon>
            </v-btn>
            <v-btn text @click="$bubble('prevStep')">Back</v-btn>
        </div>
    </v-container>
</template>

<script>
export default {
    name: "UnlockStep",
    props: ["device", "curStep", "stepNum"],

    data: () => ({
        unlocked: false,
        error: null,
    }),

    watch: {
        curStep: async function (newStep) {
            if (newStep === this.stepNum) {
                try {
                    this.unlocked =
                        (await this.device.getVariable("unlocked")) === "yes";
                } catch (e) {
                    let [handled, message] = this.bubbleError(e);
                    this.error = message;
                    if (!handled) throw e;
                }
            }
        },
    },
};
</script>
