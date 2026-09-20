import { RatingForm } from '@/components/rating-form';
import { BottomSheet } from '@/components/bottom-sheet';
import type { NewRatingInput } from '@/types';

interface QuickRateSheetProps {
  visible: boolean;
  onClose: () => void;
  locationId: string;
  onSubmit: (input: NewRatingInput) => void;
}

export function QuickRateSheet({ visible, onClose, locationId, onSubmit }: QuickRateSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Quick Rate This Spot">
      <RatingForm
        initialLocationId={locationId}
        submitLabel="Submit Quick Rating"
        onSubmit={(input) => {
          onSubmit(input);
          onClose();
        }}
      />
    </BottomSheet>
  );
}
