<template>
  <UDashboardPanel class="p-6">
    <template #header>
      <h1 class="account-setting text-3xl font-bold mb-2">Account Settings</h1>
    </template>

    <template #body>
      <div>
        <!-- Tabs -->
        <UTabs
          color="primary"
          variant="link"
          :items="items"
          class="w-full"
          size="xl"
          v-model="active"
        >
          <template #my-profile>
            <div
              class="bg-white p-6 rounded-xl flex md:flex-row flex-col justify-center items-start gap-6 mt-4 min-h-[660px]"
            >
              <div
                class="profile_settings md:w-1/2 w-full border border-gray-200 p-6 rounded-xl relative"
              >
                <!-- Edit / Save / Cancel Buttons -->
                <div class="absolute top-6 right-6 flex gap-2">
                  <UButton
                    v-if="!isEditing"
                    label="Edit"
                    variant="outline"
                    icon="i-lucide-pencil"
                    class="cursor-pointer"
                    @click="profileStore.startEdit()"
                  />
                  <template v-else>
                    <UButton
                      label="Cancel"
                      variant="outline"
                      size="sm"
                      :disabled="loading"
                      @click="profileStore.cancelEdit()"
                    />
                    <UButton
                      label="Save"
                      color="primary"
                      size="sm"
                      :loading="loading"
                      @click="saveProfile()"
                    />
                  </template>
                </div>

                <!-- Avatar & Basic Info -->
                <div class="user_profile flex items-center flex-row space-x-4">
                  <div class="h-24 w-24 rounded-md overflow-hidden relative">
                    <img
                    :src="previewUrl || (typeof form.profile_image === 'string' ? getProfileUrl(current.profile_image) : getProfileUrl(authData?.profile?.profile_image) )"
                      alt="profile_image"
                      class="h-full w-full object-cover"
                    />
                  </div>

                  <div class="user_short_info">
                    <div>
                      <h3 class="text-xl font-semibold">{{ current.name }}</h3>
                      <p class="text-sm text-gray-400">
                        {{ current.roles || "-" }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Profile Image Upload (edit mode) -->
                <div v-if="isEditing" class="mt-4">
                  <label class="text-sm text-gray-400 block mb-2"
                    >Upload Profile Image</label
                  >
                  <input
                    type="file"
                    accept="image/*"
                    @change="profileStore.onFileChange"
                  />
                  <p v-if="fileName" class="text-xs mt-1 text-gray-500">
                    {{ fileName }}
                  </p>
                </div>

                <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />

                <!-- Personal Information -->
                <div class="personal-information">
                  <h3 class="text-xl">Personal Information</h3>
                  <div class="mt-3 space-y-3">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span class="text-sm text-gray-400">Full Name</span>
                        <div class="mt-1">
                          <p v-if="!isEditing">{{ current.name }}</p>
                          <UInput
                            v-else
                            v-model="form.name"
                            class="max-w-xl"
                            size="xl"
                          />
                        </div>
                      </div>
                      <div>
                        <span class="text-sm text-gray-400">Email Address</span>
                        <div class="mt-1">
                          <p v-if="!isEditing">{{ current.email }}</p>
                          <UInput
                            v-else
                            v-model="form.email"
                            disabled
                            hint="Email cannot be changed"
                            class="max-w-xl"
                            size="xl"
                          />
                        </div>
                      </div>
                      <div>
                        <span class="text-sm text-gray-400">Phone</span>
                        <div class="mt-1">
                          <p v-if="!isEditing">{{ current.phone || "N/A" }}</p>
                          <UInput
                            v-else
                            v-model="form.phone"
                            class="max-w-xl"
                            size="xl"
                          />
                        </div>
                      </div>
                      <div>
                        <span class="text-sm text-gray-400">Address</span>
                        <div class="mt-1">
                          <p v-if="!isEditing">
                            {{ current.address || "N/A" }}
                          </p>
                          <UTextarea
                            v-else
                            v-model="form.address"
                            class="max-w-xl"
                            size="xl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Telegram read-only -->
                  <div class="mt-4">
                    <span class="text-sm text-gray-400">Telegram Username</span>
                    <p>{{ current.telegram_username || "N/A" }}</p>
                  </div>
                </div>
              </div>

              <!-- Right: Telegram & Info -->
              <div
                class="connect-social p-4 md:w-1/2 w-full rounded-xl border border-gray-200"
              >
                <h3 class="text-xl">Bind account with our Telegram bot</h3>
                <div class="telegram-connect mt-2">
                  <UButton
                    color="info"
                    size="xl"
                    class="flex items-center gap-2 cursor-pointer"
                    :disabled="tgLoading"
                    :loading="tgLoading"
                    @click="profileStore.connectTelegram()"
                    v-if="!current.telegram_id"
                  >
                    <img src="./../../assets/icons/tg.svg" class="w-5 h-5" />
                    Connect telegram
                  </UButton>
                  <div v-else>
                    <UButton
                      color="info"
                      size="xl"
                      class="flex items-center gap-2 cursor-pointer"
                      :disabled="tgLoading"
                      :loading="tgLoading"
                    >
                      <img src="./../../assets/icons/tg.svg" class="w-5 h-5" />
                      {{ current.telegram_id }}
                    </UButton>
                  </div>
                  <UModal v-model:open="isModalOpen" class="max-w-xl">
                    <template #body>
                      <div class="p-6 space-y-6 text-center">
                        <h2 class="text-2xl font-semibold text-gray-800">
                          Connect Your Telegram
                        </h2>
                        <p class="text-gray-500 text-sm">
                          Choose a method below to connect your Telegram account
                          to Roomable.
                        </p>

                        <div
                          class="bg-gray-50 rounded-2xl p-4 shadow-sm border border-gray-100"
                        >
                          <h3 class="text-base font-medium mb-3 text-gray-700">
                            Option 1: Scan QR Code
                          </h3>
                          <div class="flex justify-center">
                            <Qrcode
                              :value="telegramSession.link"
                              variant="dots"
                              class="max-w-md"
                            />
                          </div>
                          <p class="text-xs text-gray-400 mt-2">
                            Scan this QR code with Telegram to connect
                            automatically. Expiration time 5 mins
                          </p>
                        </div>

                        <!-- Divider -->
                        <div class="flex items-center my-4">
                          <div class="flex-grow border-t border-gray-200"></div>
                          <span class="text-gray-400 text-xs px-2">OR</span>
                          <div class="flex-grow border-t border-gray-200"></div>
                        </div>

                        <!-- Redirect Button -->
                        <div
                          class="bg-gray-50 rounded-2xl p-4 shadow-sm border border-gray-100"
                        >
                          <h3 class="text-base font-medium mb-3 text-gray-700">
                            Option 2: Connect via Telegram Link
                          </h3>
                          <UButton
                            color="primary"
                            variant="solid"
                            size="lg"
                            class="w-full"
                            :to="telegramSession.link"
                            target="_blank"
                          >
                            <template #leading>
                              <UIcon
                                name="i-simple-icons-telegram"
                                class="w-5 h-5"
                              />
                            </template>
                            Open Telegram
                          </UButton>
                          <p class="text-xs text-gray-400 mt-2">
                            Click the button to open Telegram and authorize the
                            connection.
                          </p>
                        </div>

                        <div class="pt-2">
                          <UButton
                            color="neutral"
                            variant="ghost"
                            size="sm"
                            @click="isModalOpen = false"
                          >
                            Cancel
                          </UButton>
                        </div>
                      </div>
                    </template>
                  </UModal>
                </div>
                <div
                  class="bg-orange-50 border border-gray-100 rounded-lg p-4 mt-4"
                  v-if="!current.telegram_id"
                >
                  <div
                    class="flex items-center text-orange-700 text-sm space-x-2"
                  >
                    <UIcon
                      name="i-heroicons-exclamation-triangle"
                      class="w-4 h-4 mr-2"
                    />
                    <span>
                      You are required to connect your account to our official
                      telegram bot in order to set up automated payment!
                    </span>
                  </div>
                </div>
                <div
                  class="bg-green-50 border border-green-100 rounded-lg p-4 mt-4"
                  v-else
                >
                  <div
                    class="flex items-center text-green-700 text-sm space-x-2"
                  >
                    <UIcon
                      name="i-lucide-badge-check"
                      class="w-4 h-4 mr-2"
                    />
                    <span>
                      You're successfully connected your account with our offical telegram bot!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UTabs>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { TabsItem } from "@nuxt/ui";
import { useProfileStore } from "~/stores/profile.store";
import { storeToRefs } from "pinia";
import { useProfileImage } from "~/composables/useProfilePicture";

const { getProfileUrl, defaultAvatar } = useProfileImage();
const profileStore = useProfileStore();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();

const {
  current,
  isEditing,
  form,
  loading,
  fileName,
  previewUrl,
  authData,
  isModalOpen,
  telegramSession,
  tgLoading,
} = storeToRefs(profileStore);
const items = ref<TabsItem[]>([
  { label: "My Profile", slot: "my-profile", value: "profile" },
  { label: "Plans & Subscription", slot: "plans", value: "plans" },
]);
const active = computed({
  get() {
    return (route.query.tab as string) || "profile";
  },
  set(tab) {
    router.push({
      path: localePath("/account/settings"),
      query: { tab },
    });
  },
});
async function saveProfile() {
  try {
    await profileStore.saveProfile();
    toast.add({
      title: "Success",
      description: "Profile updated successfully",
      color: "success",
    });
  } catch (error: any) {
    console.log(error?.data);
    toast.add({
      title: "Error",
      description: error?.data?.message || "Unexpected error!",
      color: "error",
    });
  }
}
definePageMeta({
  layout: "dashboard",
  auth: true,
});
</script>

<style scoped>
input[type="file"] {
  border: 1px dashed #e5e7eb;
  padding: 8px;
  border-radius: 6px;
}
</style>
