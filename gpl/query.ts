import { GraphQLError } from "graphql";
import { Pet } from "../types.ts";
import { PetsModel } from "../db/pet.ts";
import { getPetFromModel } from "../controllers/getPetFromModel.ts";

export const rQuery = {
    pets: async (_parent:unknown, args: {breed?: string}):Promise<Pet[]> => {
            if(args.breed){
                const pets = await PetsModel.find({breed: args.breed});
                if(pets.length == 0){
                    throw new GraphQLError(`No pet found`, {
                        extensions: {code: "NOT_FOUND"},
                    });
                }
                return await Promise.all(pets.map(async (p) => await getPetFromModel(p)));
            }
            const pets = await PetsModel.find();
            if(pets.length == 0){
                throw new GraphQLError(`No pet found`, {
                    extensions: {code: "NOT_FOUND"},
                });
            }
            return await Promise.all(pets.map(async (p) => await getPetFromModel(p)));;
    },

    pet: async(_parent:unknown, args: {id: string}): Promise<Pet> => {
            const pet = await PetsModel.findById(args.id);
            if(!pet){
                throw new GraphQLError(`No se encontro ninguna mascota con el id ${args.id}`, {
                    extensions: {code: "NOT_FOUND"},
                });
            }
            return await getPetFromModel(pet);;
    }
}