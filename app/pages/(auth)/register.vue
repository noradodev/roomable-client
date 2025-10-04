<template>
  <div class="flex justify-center items-center h-screen p-2">
    <div
      class="flex flex-col items-center justify-center gap-4 p-4 md:w-2/5 w-full h-full"
    >
      <UForm :schema="schema" :state="state" class="w-full" @submit="onSubmit">
        <div class="max-w-md space-y-8 mx-auto">
          <div class="space-y-2 flex flex-col items-center">
            <h1 class="text-4xl font-bold">
              {{ $t("auth_page.create_account") }}
            </h1>
            <div class="flex space-x-1">
              <p>{{ $t("auth_page.already_have_an_account") }}</p>
              <ULink to="/login" class="font-bold text-primary">{{$t("auth_page.login")}}</ULink>
            </div>
          </div>
          <div class="space-y-4">
            <UFormField
              :label="$t('auth_page.full_name')"
              name="full_name"
              class="w-full"
              required
            >
              <UInput v-model="state.full_name" class="w-full" size="xl" />
            </UFormField>
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
            <UFormField
              :label="$t('auth_page.confirm_password')"
              name="confirm_password"
              class="w-full"
              required
            >
              <UInput
                v-model="state.confirm_password"
                type="password"
                class="w-full"
                size="xl"
              />
            </UFormField>
          </div>
          <div class="flex justify-start items-center space-x-1">
            <UFormField name="agree_term" required>
              <UCheckbox v-model="state.agree_term" name="agree_term">
                <template #label>
                  <span class="cursor-pointer"
                    >{{ $t("auth_page.i_agree_to_the") }}
                    <ULink
                      target="_blank"
                      to="/term-and-conditions"
                      class="text-primary"
                      >{{ $t("auth_page.term_condition") }}</ULink
                    >
                    <span class="text-error"> *</span>
                  </span>
                </template>
              </UCheckbox>
            </UFormField>
          </div>

          <UButton size="xl" type="submit" class="w-full justify-center"
            >{{ $t('auth_page.register') }}</UButton
          >
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
const schema = z
  .object({
    full_name: z.string($t("validation_message.full_name")),
    email: z.email($t("validation_message.email_invalid")),
    password: z
      .string($t("validation_message.password_required"))
      .min(8, $t("validation_message.password_min_8")),
    confirm_password: z.string().optional(),
    agree_term: z
      .boolean()
      .refine(
        (value) => value === true,
        $t("validation_message.term_condition")
      ),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: $t("validation_message.confirm_password"),
    path: ["confirm_password"],
  });

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  full_name: undefined,
  email: undefined,
  password: undefined,
  confirm_password: undefined,
  agree_term: false,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: "Success",
    description: "The form has been submitted.",
    color: "success",
  });
  console.log(event.data);
}
</script>
