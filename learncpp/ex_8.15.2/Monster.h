#include <string>

#ifndef MONSTER_H
#define MONSTER_H

class Monster
{
public:
    enum MonsterType
    {
        DRAGON,
        GOBLIN,
        OGRE,
        ORC,
        SKELETON,
        TROLL,
        VAMPIRE,
        ZOMBIE,
        MAX_MONSTER_TYPES
    };

    Monster(MonsterType type_, std::string name_, std::string roar_, int hit_pts_);
    std::string getTypeString();
    void print();

private:
    MonsterType type;
    std::string name;
    std::string roar;
    int hit_pts;
};

#endif
