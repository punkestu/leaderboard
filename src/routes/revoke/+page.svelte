<script>
	let game = '';
	let email = '';
	/**
	 * @type {HTMLDivElement}
	 */
	let shade;

	const submit = async (/** @type {{ preventDefault: () => void; }} */ event) => {
		event.preventDefault();
		if (shade) {
			shade.style.display = 'flex';
		}
		if (!game || !email) {
			alert('Please fill in all fields');
			if (shade) {
				shade.style.display = 'none';
			}
			return;
		}

		const response = await fetch('/api/revoke', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ game, email })
		});

		if (response.ok) {
			alert('Key revoked successfully');
		} else {
			alert('Failed to revoke key');
		}
		if (shade) {
			shade.style.display = 'none';
		}
	};
</script>

<svelte:head>
	<title>Revoke Key</title>
	<style>
		* {
			margin: 0;
			padding: 0;
		}
	</style>
</svelte:head>
<main>
	<form on:submit={submit}>
		<h1>Revoke Key</h1>
		<label for="game">Game Name</label>
		<input type="text" id="game" placeholder="Game Name ..." bind:value={game} />
		<label for="email">Email</label>
		<input type="email" id="email" placeholder="Email ..." bind:value={email} />
		<button type="submit">Revoke</button>
	</form>
	<div id="shade" bind:this={shade}>Loading...</div>
</main>

<style>
	main {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background-color: #a1a1a1;
	}
	main > #shade {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 2rem;
		color: white;
		display: none;
	}
	form {
		background-color: white;
		border-radius: 1rem;
		width: 33%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 2rem;
		font-family: sans-serif;
	}
	@media (max-width: 768px) {
		form {
			width: 75%;
		}
	}
	form > label {
		margin-top: 10px;
	}
	form > input {
		padding: 0.5rem;
		border-radius: 5px;
		border: 1px solid #a1a1a1;
	}
	form > button {
		margin-top: 10px;
		padding: 0.5rem;
		border-radius: 5px;
		border: 1px solid #a1a1a1;
		background-color: #a1a1a1;
		color: white;
		cursor: pointer;

		font-size: 1rem;
		font-weight: 800;
	}
</style>
