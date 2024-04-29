from flask import abort
from firebase_admin import firestore
from google.cloud.firestore_v1.collection import CollectionReference
from google.cloud.firestore_v1.base_document import DocumentSnapshot


def get_next_prev(
    id: str, ref: CollectionReference, sort: str
) -> tuple[DocumentSnapshot, str | None, str | None]:
    """
    This function gets the next and previous documents in a collection.
    It uses sorting to get the next adjacent item. Not very efficient but
    HATEOAS requires it... Starting to realize why nobody in the real world
    actually uses HATEOAS.
    
    Args:
        id (str): The document ID to search.
        ref (CollectionReference): The collection the document is in.
        sort (str): The desired sorting mechanism.

    Returns:
        tuple[DocumentSnapshot, str | None, str | None]:
        A tuple containing the document with the provided id, and the two
        adjacent documents.
    """
    document = ref.document(id).get()

    if not document.exists:
        return abort(404)

    next = ref.order_by(sort)
    prev = ref.order_by(sort, direction=firestore.Query.DESCENDING)

    try:
        next = next.start_at(document).limit(2).get()[1].id
    except IndexError:
        next = None
    try:
        prev = prev.start_at(document).limit(2).get()[1].id
    except IndexError:
        prev = None
    return document, next, prev
