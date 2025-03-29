class HttpException extends Error {
    public status: number;
    public message: string;

    constructor(status: number, message: string);
    constructor(error: Error);
    constructor(error: HttpException);
    constructor(...args: (number | string | Error | HttpException)[]) {
        switch (args.length) {
            case 1: {
                let err = args[0] as Error | HttpException;
                super(err.message);

                if (err instanceof HttpException) {
                    this.message = err.message;
                    this.status = err.status;
                } else {
                    this.message = err.message;
                    this.status = 500;
                }
                break;
            }
            case 2: {
                let status = args[0] as number;
                let message = args[1] as string;

                super(message);
                this.status = status;
                this.message = message;
                break;
            }
            default: {
                let message = 'Something went wrong';
                super(message);
                this.message = message;
                this.status = 500;
                break;
            }
        }
    }
}

export default HttpException;
