#include "monstertype.h"
#include "monster.h"

int main()
{
    Monster monster1 = {MonsterType::OGRE, "Torg", 145};
    Monster monster2 = {MonsterType::SLIME, "Blurp", 23};

    printMonster(monster1);
    printMonster(monster2);

    return 0;
}
