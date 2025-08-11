import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { apiClient } from "../Axios";
import {
  updateHospitalData,
  Hospital,
  Review,
} from "../../Redux/HospitalsData";
import { RootState } from "../../Redux/Store";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Send,
  Star,
  Trash2,
} from "lucide-react-native";

export const ReviewComponent = ({
  hospital,
  navigation,
}: {
  hospital: Hospital;
  navigation: any;
}) => {
  const dispatch = useDispatch();
  const { _id } = useSelector((state: RootState) => state.userLogin);

  const [newReview, setNewReview] = useState<Partial<Review>>({
    rating: 0,
    comment: "",
  });
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (!_id) {
      navigation.navigate("Login");
    }
  }, [_id, navigation]);

  const handleReviewSubmit = async () => {
    if (!_id) {
      navigation.navigate("Login");
      return;
    }
    if (!newReview.rating) {
      Alert.alert("Error", "Please rate the hospital");
      return;
    }
    try {
      const result = await apiClient.post(`/api/reviews/${hospital._id}`, {
        user_id: _id,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString(),
      });

      dispatch(updateHospitalData({ data: result.data.data }));
      setNewReview({ rating: 0, comment: "" });
    } catch (err) {
      Alert.alert("Error", "Unable to submit review.");
    }
  };

  const handleReviewUpdate = async (reviewId: string) => {
    try {
      const result = await apiClient.put(
        `/api/reviews/${hospital._id}/${reviewId}`,
        {
          rating: newReview.rating,
          comment: newReview.comment,
        }
      );

      dispatch(updateHospitalData({ data: result.data.data }));
      setEditingReview(null);
      setNewReview({ rating: 0, comment: "" });
    } catch (err) {
      console.log("Err", err);
      Alert.alert("Error", "Unable to update review.");
    }
  };

  const handleReviewDelete = async (reviewId: string) => {
    try {
      const result = await apiClient.delete(
        `/api/reviews/${hospital._id}/${reviewId}`
      );

      dispatch(updateHospitalData({ data: result.data.data }));
    } catch (err) {
      Alert.alert("Error", "Unable to delete review.");
    }
  };

  const startEditing = (review: Review) => {
    setEditingReview(review._id as string);
    setNewReview({ rating: review.rating, comment: review.comment });
  };

  const renderReview = ({ item: review }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewUser}>
          {review.user_id._id === _id ? "You" : review.user_id.name}
        </Text>
        <Text style={styles.reviewDate}>
          {new Date(review.date).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            width={16}
            height={16}
            color={star <= review.rating ? "gold" : "gray"}
          />
        ))}
      </View>
      {editingReview === review._id ? (
        <View>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setNewReview({ ...newReview, rating: star })}
              >
                <Star
                  width={24}
                  height={24}
                  color={star <= (newReview.rating ?? 0) ? "gold" : "gray"}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.textInput}
            value={newReview.comment}
            onChangeText={(text) =>
              setNewReview({ ...newReview, comment: text })
            }
            placeholder="Update your review..."
            multiline
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => handleReviewUpdate(review._id as string)}
            >
              <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditingReview(null)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.reviewContentRow}>
          <Text style={styles.reviewComment}>{review.comment}</Text>
          {review.user_id._id === _id && (
            <>
              <TouchableOpacity onPress={() => startEditing(review)}>
                <Edit2 width={20} height={20} color="green" />
              </TouchableOpacity>
              <Text>{"      "}</Text>
              <TouchableOpacity
                onPress={() => handleReviewDelete(review._id as string)}
              >
                <Trash2 width={20} height={20} color="red" />
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reviews</Text>

      <View style={styles.reviewForm}>
        <Text style={styles.subHeading}>Write a Review</Text>

        <View>
          <Text style={styles.label}>Rating</Text>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setNewReview({ ...newReview, rating: star })}
              >
                <Star
                  width={24}
                  height={24}
                  color={star <= (newReview.rating ?? 0) ? "gold" : "gray"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View>
          <Text style={styles.label}>Comment</Text>
          <TextInput
            style={styles.textInput}
            value={newReview.comment}
            onChangeText={(text) =>
              setNewReview({ ...newReview, comment: text })
            }
            placeholder="Write your review here..."
            multiline
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleReviewSubmit}
          disabled={editingReview !== null}
        >
          <Text style={styles.submitButtonText}>Submit Review</Text>
          <Send width={16} height={16} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={showAllReviews ? hospital.reviews : hospital.reviews.slice(0, 2)}
        renderItem={renderReview}
        keyExtractor={(item) => item._id as string}
        ListFooterComponent={() =>
          hospital.reviews.length > 2 ? (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowAllReviews(!showAllReviews)}
            >
              <Text style={styles.showMoreText}>
                {showAllReviews ? "Show Less" : "Show More"}
              </Text>
              {showAllReviews ? (
                <ChevronUp width={16} height={16} color="green" />
              ) : (
                <ChevronDown width={16} height={16} color="green" />
              )}
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "darkgreen",
    marginBottom: 16,
  },
  reviewForm: {
    backgroundColor: "#f0fff0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  subHeading: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  label: { fontSize: 14, color: "darkgreen", marginBottom: 4 },
  ratingRow: { flexDirection: "row", marginBottom: 12 },
  textInput: {
    borderWidth: 1,
    borderColor: "lightgreen",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    minHeight: 40,
    backgroundColor: "white",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
  },
  submitButtonText: { color: "white", fontSize: 16, marginRight: 8 },
  reviewCard: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  reviewUser: { fontSize: 14, fontWeight: "bold", color: "darkgreen" },
  reviewDate: { fontSize: 12, color: "gray" },
  reviewContentRow: { flexDirection: "row", justifyContent: "space-between" },
  reviewComment: { fontSize: 14, color: "gray", flex: 1 },
  buttonRow: { flexDirection: "row", marginTop: 8 },
  updateButton: { backgroundColor: "green", padding: 8, borderRadius: 8 },
  updateButtonText: { color: "white", fontSize: 14 },
  cancelButton: {
    marginLeft: 8,
    backgroundColor: "lightgray",
    padding: 8,
    borderRadius: 8,
  },
  cancelButtonText: { color: "black", fontSize: 14 },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  showMoreText: { color: "darkgreen", fontSize: 14, marginRight: 4 },
});
