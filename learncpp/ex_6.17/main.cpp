#include <iostream>

enum ItemTypes
{
    ITEM_HEALTH_POTIONS,
    ITEM_TORCHES,
    ITEM_ARROWS,
    NUM_ITEMS
};

int countTotalItems(int *items)
{
    int total = 0;
    for (int i = 0; i < NUM_ITEMS; i++)
        total += items[i];
    return total;
}

int main()
{
    int items[NUM_ITEMS];
    items[ITEM_HEALTH_POTIONS] = 2;
    items[ITEM_TORCHES] = 5;
    items[ITEM_ARROWS] = 10;

    std::cout << "The character has " << countTotalItems(items) <<
                 " total items." << std::endl;
    return 0;
}
