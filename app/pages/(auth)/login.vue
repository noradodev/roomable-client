<template>
  <div class="flex justify-center items-center h-screen p-2">
    <div
      class="flex flex-col items-center justify-center gap-4 p-4 md:w-2/5 w-full h-full"
    >
      <UForm :schema="schema" :state="state" class="w-full" @submit="onSubmit">
        <div class="max-w-md space-y-8 mx-auto">
          <div class="space-y-2 flex flex-col items-center">
            <h1 class="text-4xl font-bold">
              {{ $t("auth_page.login") }}
            </h1>
            <div class="flex space-x-1">
              <p>{{ $t("auth_page.already_have_an_account") }}</p>
              <ULink to="/login" class="font-bold text-primary">{{
                $t("auth_page.register")
              }}</ULink>
            </div>
          </div>
          <div class="space-y-4">
            <UFormField
              :label="$t('auth_page.email')"
              name="email"
              class="w-full"
              required
            >
              <UInput v-model="state.email" class="w-full" size="xl" />
            </UFormField>

            <UFormField
              :label="$t('auth_page.password')"
              name="password"
              class="w-full"
              required
            >
              <UInput
                v-model="state.password"
                type="password"
                size="xl"
                class="w-full"
              />
            </UFormField>
          </div>
       

          <UButton size="xl" type="submit" class="w-full justify-center">{{
            $t("auth_page.login")
          }}</UButton>
        </div>
      </UForm>
    </div>
    <div class="md:w-3/5 h-full">
      <pre></pre>
      <div class="overflow-hidden h-full rounded-2xl">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"
          alt=""
          class="object-cover h-full w-full"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
const { t } = useI18n();
const loading = ref(false);
const { signIn } = useAuth();
const schema = z
  .object({
    email: z.email($t("validation_message.email_invalid")),
    password: z
      .string($t("validation_message.password_required"))
      .min(8, $t("validation_message.password_min_8")),
    
  })

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    loading.value = true;
    await signIn(event.data, { 
    callbackUrl: '/dashboard' 
});
    toast.add({
      title: "Success",
      description: "You have been logged in successfully!",
      color: "success",
    });
  } catch (error: any) {
    console.log(error)
    toast.add({
      title: "Error",
      description: error?.data?.message || "Unknown unexpected error!",
      color: "error",
    });
  } finally
  {
    loading.value = false;
  }
}
definePageMeta({
  auth: {
    unauthenticatedOnly: true, 
    navigateAuthenticatedTo: '/dashboard', 
  }
})
</script>
