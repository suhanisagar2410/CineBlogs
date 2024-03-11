// import { Client, Account, ID } from "appwrite";
// import configs from "../Config/Config";

// export class AuthService {
//   client = new Client();
//   account;

//   constructor() {
//     this.client.setEndpoint(configs.appWriteEndpoint).setProject(configs.projectId);
//     console.log(configs.appWriteEndpoint);
//     console.log(configs.bucketId);
    
//     this.account = new Account(this.client);
//   }

//   async createAccount({ email, name, password }) {
//     try {
//       const userAccount = await this.account.create(
//         ID.unique(),
//         email,
//         password,
//         name,
//       );

//       if (userAccount) {
//         return this.login({ email, password });
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async login({ email, password }) {
//     try {
//       return await this.account.createEmailSession(email, password);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async getUser() {
//     try {
//       return await this.account.get();
//     } catch (error) {
//       console.log(error);
//     }

//     return null;
//   }

//   async logOut() {
//     try {
//       return await this.account.deleteSession();
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

// const authService = new AuthService();

// export default authService;



import configs from "../Config/Config";
import { Client, Account, ID } from "appwrite";


export class AuthService {
    client = new Client();
    account;

    constructor() {
      this.client.setEndpoint(configs.appWriteEndpoint).setProject(configs.projectId);
     
        this.account = new Account(this.client);
            
    }

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // call another method
                return this.login({email, password});
            } else {
               return  userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({email, password}) {
        try {
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite serive :: getCurrentUser :: error", error);
        }

        return null;
    }

    async logOut() {

        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService