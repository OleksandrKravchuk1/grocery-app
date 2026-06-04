import {createClient} from '@supabase/supabase-js';

const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.ROLE_KEY!
);

async function seed() {
    const {data, error} = await supabase
        .from('products')
        .insert([]);

    if (error) console.error('Помилка:', error);
    else console.log('Успішно:', data);
}

seed();