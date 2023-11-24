import { Pet } from "../types.ts";
import { PetsModel } from "../db/pet.ts";
import { getPetFromModel } from "../controllers/getPetFromModel.ts";
import { GraphQLError } from "graphql";

export const rMutation = {
    addPet: async (_parent:unknown, args: {name: string, breed: string}):Promise<Pet> => {
        const pet = new PetsModel({name: args.name,breed: args.breed});
        await pet.save();
        
        if(!args.name || !args.breed){
            throw new GraphQLError( "No estan todas las variables necesarias",{
                extensions: {code: "INTERNAL_SERVER_ERROR"},
            });
        }

        return await getPetFromModel(pet);;        
    },

    deletePet: async (_parent:unknown, args: {id: string}):Promise<Pet> => {
            const pet = await PetsModel.findByIdAndDelete(args.id);

            if(!pet){
                throw new GraphQLError(`No se encontro ninguna mascota con el id ${args.id}`, {
                    extensions: {code: "NOT_FOUND"},
                });
            }

            return await getPetFromModel(pet);;
    },

    updatePet: async (_parent:unknown, args: {id: string, name: string, breed: string}):Promise<Pet> => {
            const pet = await PetsModel.findOneAndUpdate({_id: args.id}, 
                                        {name: args.name, breed: args.breed});
            
            if(!pet){
                throw new GraphQLError(`No se encontro ninguna mascota con el id ${args.id}`, {
                    extensions: {code: "NOT_FOUND"},
                });
            }
            await pet.save();
            
            return await getPetFromModel(pet); //Se me ha atascado mostrar el valor actualizado pero lo actualiza en la base de datos
    },
}