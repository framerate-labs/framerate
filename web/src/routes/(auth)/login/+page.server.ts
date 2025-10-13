import type { Actions, PageServerLoad } from './$types';

import { fail } from '@sveltejs/kit';
import { loginSchema } from '$schemas/authSchema';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod4(loginSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(loginSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// Do something with form data

		return {
			form
		};
	}
};
