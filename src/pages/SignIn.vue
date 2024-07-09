<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardDescription from '@/components/ui/card/CardDescription.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import { FormField } from '@/components/ui/form';
import FormControl from '@/components/ui/form/FormControl.vue';
import FormItem from '@/components/ui/form/FormItem.vue';
import FormLabel from '@/components/ui/form/FormLabel.vue';
import FormMessage from '@/components/ui/form/FormMessage.vue';
import Input from '@/components/ui/input/Input.vue';
import { signIn } from '@/stores/session';
import { toTypedSchema } from '@vee-validate/zod';
import { AxiosError } from 'axios';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { z } from 'zod';

const router = useRouter()

const formSchema = toTypedSchema(z.object({
  name: z.string().min(3).max(20),
  password: z.string().min(6).max(20),
}))

const { handleSubmit, setFieldError } = useForm({
  validationSchema: formSchema
})

const onSubmit = handleSubmit(async (credentials) => {
  try {
    await signIn(credentials)
    router.push('/')
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 400) {
      setFieldError('password', 'Wrong credentials')
    } else {
      console.error(err)
    }
  }
})
</script>

<template>
  <div class="h-full flex justify-center items-center">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-xl">
          Sign in
        </CardTitle>
        <CardDescription>
          Enter your credentials to sign in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit" class="flex flex-col gap-4">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit" class="w-full">
            Sign in
          </Button>
          <div class="mt-4 text-center text-sm">
            Not registered?
            <Button variant="link" as-child class="p-0">
              <RouterLink to="/sign-up">
                Sign up
              </RouterLink>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
