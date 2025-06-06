// app/forms/[formId]/layout.tsx

import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { Session } from 'next-auth';
import { appRouter } from '@/server/trpc/routers';
import { TRPCError } from '@trpc/server';
import { FormBuilderProvider } from '@/components/form-builder/context';
import type { FormFieldDefinition } from '@/components/form-builder/types';
import { FormBuilderNav } from '@/components/form-builder/ui/Nav';
import { z } from 'zod';
import { FormFieldOptionsSchema } from '@/server/trpc/routers/form';

type FormFieldOptionsType = z.infer<typeof FormFieldOptionsSchema>;

export default async function FormBuilderLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ formId: string }>
}) {
  const { formId } = await params;

  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user) redirect('/sign-in');

  // 2) fetch form
  const caller = appRouter.createCaller({ session, user: session.user });
  let formWithRole;
  try {
    formWithRole = await caller.form.getById({ id: formId });
  } catch (e) {
    if (e instanceof TRPCError && ['NOT_FOUND', 'FORBIDDEN'].includes(e.code)) {
      throw new Error(e.code);
    }
    throw e;
  }
  const { fields, name, description, version, userRole } = formWithRole;

  // 3) transform saved fields into your FormFieldDefinition[]
  const initialFields: FormFieldDefinition[] = fields.map(field => {
    const options = field.options as FormFieldOptionsType;
    return {
      ...field,
      ...options,
      type: options.fieldType as FormFieldDefinition['type'],
      label: options.label,
      id: field.id,
    } as FormFieldDefinition;
  });

  // 4) wrap everything in your provider, passing only the “initial” props
  return (
    <FormBuilderProvider
      formId={formId}
      initialFieldsData={initialFields}
      initialName={name ?? 'Untitled Form'}
      initialDescription={description ?? ''}
      initialVersion={version}
      userRole={userRole}
    >
      {/* our new client nav */}
      <FormBuilderNav
        formId={formId}
        initialName={name ?? 'Untitled Form'}
        initialDescription={description ?? ''}
        initialVersion={version}
      />

      {/* the rest of your form‐builder UI (pages/children) */}
      <div style={{ height: 'calc(100vh - 120px)' }}>
        {children}
      </div>
    </FormBuilderProvider>
  );
}
