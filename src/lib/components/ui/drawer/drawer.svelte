<script>
	let { open = $bindable(false), title = '', children } = $props();
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex justify-end">
		<button
			class="absolute inset-0 bg-black/50 transition-opacity"
			onclick={() => (open = false)}
			aria-label="Close drawer"
		></button>
		<div
			class="relative z-10 flex h-full w-full max-w-md flex-col bg-background shadow-xl transition-transform duration-300"
		>
			<div class="flex items-center justify-between border-b px-6 py-4">
				<h2 class="font-heading text-xl font-semibold">{title}</h2>
				<button
					onclick={() => (open = false)}
					class="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
				>
					<svg
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="flex-1 overflow-y-auto p-6">
				{@render children()}
			</div>
		</div>
	</div>
{/if}
