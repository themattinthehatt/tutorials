#include <iostream> // <> mean look for header file in system directories
#include "add.h"    // "" mean look for header in current directory

int main()
{
    std::cout << "The sum of 3 and 4 is: " << add(3, 4) << std::endl;
    return 0;
}
