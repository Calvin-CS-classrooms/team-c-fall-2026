import { RatingForm } from '@/components/rating-form';
import { BottomSheet } from '@/components/bottom-sheet';
import type { NewRatingInput } from '@/types';

interface QuickRateSheetProps {
  visible: boolean;
  onClose: () => void;
  locationId: string;
  onSubmit: (input: NewRatingInput) => void;
}

/**
 * The "Quick Rate This Spot" bottom sheet on the home screen. Wraps the
 * rating form in a bottom sheet, preselecting the given location. Submitting
 * the form forwards the rating and closes the sheet.
 *
 * @param visible - Whether the sheet is shown.
 * @param onClose - Called when the sheet is dismissed.
 * @param locationId - Location preselected in the rating form.
 * @param onSubmit - Called with the completed rating when submitted.
 */
export function QuickRateSheet({ visible, onClose, locationId, onSubmit }: QuickRateSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Quick Rate This Spot">
      <RatingForm
        initialLocationId={locationId}
        submitLabel="Submit Quick Rating"
        // Forward the rating to the caller, then dismiss the sheet.
        onSubmit={(input) => {
          onSubmit(input);
          onClose();
        }}
      />
    </BottomSheet>
  );
}
