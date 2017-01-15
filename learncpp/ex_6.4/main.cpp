#include <iostream>
#include <utility>

// simple implementation of selection sort

int main()
{
    int len_array = 10;
    int array[len_array] = {4, 1, 0, 9, 3, 2, 6, 8, 7, 5};

    // iterate through array (don't need to "order" last element)
    for (int i = 0; i < len_array - 1; i++)
    {
        int min_idx = i;

        for (int j = i + 1; j < len_array; j++)
        {
            if (array[j] < array[min_idx])
                min_idx = j;
        }

        // swap current value at index i with value at min_idx
        std::swap(array[i], array[min_idx]);

        // print debug info
        std::cout << "Array at step " << i << ":" << std::endl;
        for (int j = 0; j < len_array; j++)
            std::cout << array[j] << " ";

    }

}
