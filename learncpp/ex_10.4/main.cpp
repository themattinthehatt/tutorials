#include <iostream>
#include "IntArray.h"

int main()
{
    // declare an array with 10 elements
    IntArray cArray(10);
    for (int i = 0; i < cArray.GetLength(); i++)
        std::cout << cArray[i] << " ";
    std::cout << '\n';

    // fill the array with numbers 1 through 10
    for (int i = 0; i < 10; i++)
        cArray[i] = i+1;
    for (int i = 0; i < cArray.GetLength(); i++)
        std::cout << cArray[i] << " ";
    std::cout << '\n';

    // resize the array to 8 elements
    cArray.resize(8);
    for (int i = 0; i < cArray.GetLength(); i++)
        std::cout << cArray[i] << " ";
    std::cout << '\n';

    // insert the number 20 before element with index 5
    cArray.insertBefore(20, 5);
    for (int i = 0; i < cArray.GetLength(); i++)
        std::cout << cArray[i] << " ";
    std::cout << '\n';

    // remove the element with index 3
    cArray.remove(3);
    for (int i = 0; i < cArray.GetLength(); i++)
        std::cout << cArray[i] << " ";
    std::cout << '\n';

    return 0;
}
