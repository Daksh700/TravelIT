import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { createOrder, verifyPayment } from "@/services/payment";

export function usePayment() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    const createOrderMutation = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            if (!token) throw new Error("Authentication required");
            return await createOrder(token);
        }
    });

    const verifyPaymentMutation = useMutation({
        mutationFn: async (order_id: string) => {
            const token = await getToken();
            if (!token) throw new Error("Authentication required");
            return await verifyPayment(token, order_id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        }
    });

    return {
        createOrder: createOrderMutation.mutateAsync,
        verifyPayment: verifyPaymentMutation.mutateAsync,
        isProcessing: createOrderMutation.isPending || verifyPaymentMutation.isPending
    };
}