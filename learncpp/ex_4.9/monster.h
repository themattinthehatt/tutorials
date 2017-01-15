#ifndef MONSTER_H
#define MONSTER_H

#include <iostream>
#include <string>
#include "monstertype.h"

struct Monster
{
    MonsterType type;
    std::string name;
    int health;
};

void printMonster(Monster monster)
{
    if (monster.type == MonsterType::OGRE)
        std::cout << "This Ogre is named " << monster.name << "and has " <<
                  monster.health << " health" << std::endl;
    else if (monster.type == MonsterType::DRAGON)
        std::cout << "This Dragon is named " << monster.name << "and has " <<
                  monster.health << " health" << std::endl;
    else if (monster.type == MonsterType::ORC)
        std::cout << "This Orc is named " << monster.name << "and has " <<
                  monster.health << " health" << std::endl;
    else if (monster.type == MonsterType::GIANT_SPIDER)
        std::cout << "This Giant Spider is named " << monster.name << "and has " <<
                  monster.health << " health" << std::endl;
    else if (monster.type == MonsterType::SLIME)
        std::cout << "This Slime is named " << monster.name << "and has " <<
                  monster.health << " health" << std::endl;
    else
        std::cout << "Unknown monster type!" << std::endl;
}

#endif
