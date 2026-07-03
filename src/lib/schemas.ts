import { z } from 'zod';

export const LeadSchema = z.object({
  shopName: z.string().min(1, 'Shop Name is required').max(100),
  clientName: z.string().min(1, 'Client Name is required').max(100),
  phone: z
    .string()
    .max(25)
    .regex(/^[\+0-9\s\-()]*$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  interestLevel: z.enum(['High', 'Medium', 'Low', 'Not Interested']),
  quotedPrice: z.coerce.number().min(0).optional().or(z.literal('')),
  notes: z.string().max(1000).optional(),
});

export const AgreementSchema = z.object({
  // Client Details
  clientName: z.string().min(1, 'Client Name is required').max(100),
  companyName: z.string().min(1, 'Company Name is required').max(100),
  email: z.string().email('Invalid email address').max(150),
  phone: z.string().max(25).regex(/^[\+0-9\s\-()]*$/, 'Invalid phone number'),
  address: z.string().min(1, 'Address is required').max(250),
  // Project Details
  projectName: z.string().min(1, 'Project Name is required').max(100),
  projectType: z.string().min(1, 'Project Type is required').max(100),
  description: z.string().min(1, 'Description is required'),
  deliverables: z.string().min(1, 'Deliverables are required'),
  startDate: z.string().min(1, 'Start Date is required'),
  completionDate: z.string().min(1, 'Completion Date is required'),
  // Pricing
  totalCost: z.coerce.number().min(0, 'Must be positive'),
  advancePayment: z.coerce.number().min(0, 'Must be positive'),
  paymentSchedule: z.string().min(1, 'Payment Schedule is required').max(250),
  // Scope & Legal
  includedFeatures: z.string().optional(),
  ownership: z.string().min(1, 'Ownership terms are required'),
  // Agency Signature
  providerName: z.string().min(1, 'Agency Rep Name is required').max(100),
  providerSignature: z.string().nullable().refine((val) => val !== null, { message: 'Signature is required' }),
});

export type LeadData = z.infer<typeof LeadSchema>;
export type AgreementDataSchema = z.infer<typeof AgreementSchema>;
