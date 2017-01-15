#include <iostream>

// array is the array to search over.
// target is the value we're trying to determine exists or not
// min is the index of the lower bounds of the array we're searching
// max is the index of the upper bounds of the array we're searching
// binarySearch() should return the index of the target element if the target
//  is found, -1 otherwise
int binarySearchIterative(int *array, int target, int min_indx, int max_indx)
{

    int mid_indx = -1;

    do {

        // make sure target could be in array
        if ((target < array[min_indx]) || (target > array[max_indx]))
            return -1;

        // make sure target is not between consecutive indices
        if (max_indx == min_indx + 1 && target > array[min_indx] && target < array[max_indx])
            return -1;
//        if ((min_indx == max_indx) && (array[min_indx] != target))
//            return -1;

        mid_indx = (min_indx + max_indx) / 2;
        if (array[mid_indx] == target)
            return mid_indx;
        else if (array[mid_indx] > target)
            // we want to consider the lower half of current array
            max_indx = mid_indx;
        else if (array[mid_indx] < target)
            // we want to consider the upper half of current array
            min_indx = mid_indx;
    } while (min_indx <= max_indx);

    return -1;

}

int binarySearchRecursive(int *array, int target, int min_indx, int max_indx)
{
    if (min_indx > max_indx)
        return -1;

    int mid_indx = (min_indx + max_indx) / 2;

    if (target == array[mid_indx])
        return mid_indx;
    else if (target > array[mid_indx])
        return binarySearchRecursive(array, target, mid_indx+1, max_indx);
    else
        return binarySearchRecursive(array, target, min_indx, max_indx-1);

}
int main()
{
    int array[] = {3, 6, 8, 12, 14, 17, 20, 21, 26, 32, 36, 37, 42, 44, 48};

    // we're gonig to test a bunch of values to see if they produce the expected
    // results
    const int numTestValues = 9;
    // here are the test values
    int testValues[numTestValues] = {0, 3, 12, 13, 22, 26, 43, 44, 49};
    // and here are the expected results for each value
    int expectedValues[numTestValues] = {-1, 0, 3, -1, -1, 8, -1, 13, -1};

    // loop through all of the test values
    for (int count = 0; count < numTestValues; count++)
    {
        // see if our test value is in the array
        int index = binarySearchRecursive(array, testValues[count], 0, 14);

        if (index == expectedValues[count])
            // if it matches our expected value, then great!
            std::cout << "test value " << testValues[count] << " passed!\n";
        else
            // otherwise, our binarySearch() function must be broken
            std::cout << "test value " << testValues[count] << " failed.\n";
    }
    return 0;
}
