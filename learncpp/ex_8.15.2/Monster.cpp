#include <iostream>
#include <string>
#include "Monster.h"

Monster::Monster(MonsterType type_, std::string name_, std::string roar_, int hit_pts_)
{
    type = type_;
    name = name_;
    roar = roar_;
    hit_pts = hit_pts_;
}

std::string Monster::getTypeString()
{
    switch (type)
    {
        case Monster::DRAGON:
            return "dragon";
        case Monster::GOBLIN:
            return "goblin";
        case Monster::OGRE:
            return "ogre";
        case Monster::ORC:
            return "orc";
        case Monster::SKELETON:
            return "skeleton";
        case Monster::TROLL:
            return "troll";
        case Monster::VAMPIRE:
            return "vampire";
        case Monster::ZOMBIE:
            return "zombie";
        default:
            return "monster error";
    }
}

void Monster::print()
{
    std::cout << name << " the " << getTypeString()
              << " has " << hit_pts << " hit points and says "
              << roar << std::endl;
}
