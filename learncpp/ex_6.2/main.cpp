#include <iostream>

namespace Animals
{
    enum Animals
    {
        CHICKEN,
        DOG,
        CAT,
        ELEPHANT,
        DUCK,
        SNAKE,
        MAX_ANIMALS
    };
}

int main()
{
    int animals[Animals::MAX_ANIMALS];
    animals[Animals::CHICKEN] = 2;
    animals[Animals::DOG] = 4;
    animals[Animals::CAT] = 4;
    animals[Animals::ELEPHANT] = 4;
    animals[Animals::DUCK] = 2;
    animals[Animals::SNAKE] = 0;

    std::cout << "An elephant has " << animals[Animals::ELEPHANT] << " legs." << std::endl;

    return 0;
}
