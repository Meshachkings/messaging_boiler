import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production'],
        }),
        MONGO_PASSWORD: str(),
        MONGO_CLUSTER: str(),
        MONGO_DB_NAME: str(),
        MONGO_USER: str(),
        PORT: port({ default: 3000 }),
        MAIL_HOST: str(),
        MAIL_USERNAME: str(),
        MAIL_PASSWORD: str(),
    });
}

export default validateEnv;
