#include <iostream>
#include <string>
#include "animal.h"

std::string getAnimalName(Animal animal)
{
    switch (animal)
    {
        case Animal::PIG:
            return "pig";
        case Animal::CHICKEN:
            return "chicken";
        case Animal::GOAT:
            return "goat";
        case Animal::CAT:
            return "cat";
        case Animal::DOG:
            return "dog";
        case Animal::OSTRICH:
            return "ostrich";
        default:
            return "ERROR!";
    }
}

void printNumberOfLegs(Animal animal)
{
    switch (animal)
    {
        case Animal::OSTRICH:
        case Animal::CHICKEN:
            std::cout << "A " << getAnimalName(animal) << " has 2 legs." << std::endl;
            break;
        case Animal::PIG:
        case Animal::GOAT:
        case Animal::CAT:
        case Animal::DOG:
            std::cout << "A " << getAnimalName(animal) << " has 4 legs." << std::endl;
            break;
        default:
            std::cout << "ERROR!" << std::endl;
    }
}

int main()
{
    printNumberOfLegs(Animal::CAT);
    printNumberOfLegs(Animal::CHICKEN);

    return 0;
}
