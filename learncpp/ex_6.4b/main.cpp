#include <iostream>
#include <utility>

// simple implementation of selection sort

int main()
{
    int len_array = 10;
    int array[len_array] = {4, 1, 0, 9, 3, 2, 6, 8, 7, 5};

    // iterate through array
    for (int i = 0; i < len_array - 1; i++)
    {
        for (int j = 0; j < len_array - i - 1; j++)
        {
            if (array[j] > array[j+1])
                std::swap(array[j], array[j+1]);
        }

        // print debug info
        std::cout << "Array at step " << i << ":" << std::endl;
        for (int j = 0; j < len_array; j++)
            std::cout << array[j] << " ";
    }
}
