#ifndef INTARRAY_H
#define INTARRAY_H

#include <assert.h> // for assert()

class IntArray
{
private:
    int nLength;
    int *pnData;

public:
    IntArray()
    {
        nLength = 0;
        pnData = nullptr;
    }

    IntArray(int newLength)
    {
        pnData = new int[newLength];
        nLength = newLength;
    }

    ~IntArray()
    {
        delete[] pnData;
    }

    void Erase()
    {
        delete[] pnData;
        // We need to make sure we set pnData to 0 here, otherwise it will
        // be left pointing at deallocated memory!
        pnData = nullptr;
        nLength = 0;
    }

    int& operator[](int nIndex)
    {
//        assert(nIndex >= 0 && nIndex < nLength);
        return pnData[nIndex];
    }

    int GetLength() { return nLength; }

    // reallocate resizes the array. any existing elements will be destroyed
    // this function operates quickly
    void reallocate(int newLength)
    {
        // first we delete any existing elements
        Erase();

        // if our array is going to be empty now, return here
        if (newLength <= 0)
            return;

        // then we have to allocate new elements
        pnData = new int[newLength];
        nLength = newLength;
    }

    // resize resizes the array; any existing elements will be kept.
    // this function operates slowly
    void resize(int newLength)
    {
        // if we are resizing to an empty array, do that and return
        if (newLength <= 0)
        {
            Erase();
            return;
        }

        // now we can assume newLength is at least 1 element. This
        // algorithm works as follows: first we are going to allocate
        // a new array; then we are going to copy elements from the
        // existing array to the new array. Once that is done, we can
        // destroy the old array, and make pnData point to the new array.

        // first we have to allocate a new array
        int *temp_pnData = new int[newLength];

        // then we have to figure out how many elements to copy from
        // the existing array to the new array. We want to copy as many
        // elements as there are in the smaller of hte two arrays.
        if (nLength > 0)
        {
            int nElementsToCopy = (newLength > nLength) ? nLength : newLength;
            // Now copy the elements one by one
            for (int nIndex=0; nIndex < nElementsToCopy; nIndex++)
                temp_pnData[nIndex] = pnData[nIndex];

        }

        // Now we can delete the old array because we don't need it any more
        delete[] pnData;

        // And use the new array instead!  Note that this simply makes m_pnData point
        // to the same address as the new array we dynamically allocated.  Because
        // pnData was dynamically allocated, it won't be destroyed when it goes out of scope.
        pnData = temp_pnData;
        nLength = newLength;
    }

    void insertBefore(int nValue, int nIndex)
    {
        // sanity check our nIndex value
        assert(nIndex >= 0 && nIndex < nLength);

        // first create a new array one element larger than the old array
        int *temp_pnData = new int[nLength+1];

        // copy all of the elements up to the index
        for (int i = 0; i < nIndex; ++i)
            temp_pnData[i] = pnData[i];

        // insert our new element into the array
        temp_pnData[nIndex] = nValue;

        // copy all of the values after the inserted element
        for (int i = nIndex+1; i < nLength+1; ++i)
            temp_pnData[i] = pnData[i-1];

        // destroy pnData
        delete[] pnData;

        // set pnData to point to the new array
        pnData = temp_pnData;

        // update length
        nLength++;
    }

    void remove(int nIndex)
    {
        // sanity check our nIndex value
        assert(nIndex >= 0 && nIndex < nLength);

        // if only 1 element, return emptied array
        if (nLength == 0 || nLength == 1)
            Erase();

        // first create a new array one element smaller than the old array
        int *temp_pnData = new int[nLength-1];

        // place data up to nIndex in new array
        for (int i = 0; i < nIndex; ++i)
            temp_pnData[i] = pnData[i];

        // place data after nIndex in new array
        for (int i = nIndex+1; i < nLength; ++i)
            temp_pnData[i-1] = pnData[i];

        // destroy pnData
        delete[] pnData;

        // set pnData to point to the new array
        pnData = temp_pnData;

        // update length
        nLength--;

    }
};

#endif
