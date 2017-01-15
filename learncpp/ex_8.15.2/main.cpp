#include <iostream>
#include <random>
#include <time.h>
#include <string>
#include "Monster.h"

class MonsterGenerator
{
public:


    static Monster generateMonster()
    {
        static std::string s_names[6] {"Timmy", "Tommy", "Bilbo", "Bjorn", "Rafael", "Shirley"};
        static std::string s_roars[6] {"Rawr", "Bark bark mothafucka!", "Ke-yah!", "Karate chop!", "Hi!", "Shaaaaawt"};

        return Monster(static_cast<Monster::MonsterType>(getRandomNumber(1, Monster::MAX_MONSTER_TYPES-1)),
                      s_names[getRandomNumber(0, 5)],
                      s_roars[getRandomNumber(0, 5)],
                      getRandomNumber(1, 100));
    }

    static int getRandomNumber(int min, int max)
    {
        return min + rand() % (max - min);
    }

};


int main()
{

    srand(static_cast<unsigned int>(time(0)));

    Monster m = MonsterGenerator::generateMonster();
    m.print();

    return 0;
}
